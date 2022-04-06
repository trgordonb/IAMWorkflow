const AdminJS = require('adminjs')
const AccountPolicy = require('../models/account-policy')
const AccountFee = require('../models/account-fee.model')
const Statement = require('../models/statement.model')
const Period = require('../models/period-model')
const Currency = require('../models/currency.model')
const CurrencyHistory = require('../models/currency-history.model')
const FeeSharing = require('../models/fee-sharing.model')
const FeeSharingHistory = require('../models/feeshare-history.model')
const AccountLedgerBalance = require('../models/account-ledger-balance.model')

const StatementResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        from: {
            isVisible: { list: true, filter: false, show: true, edit: true },
        },
        statementcode: {
            isVisible: { list: true, filter: true, show: true, edit: true },
        },
        date: {
            type: 'date',
            isVisible: { list: false, filter: true, show: true, edit: true },
        },
        period: {
            isVisible: { list: true, filter: true, show: true, edit: true },
        },
        tag: {
            isVisible: { list: false, filter: true, show: true, edit: true },
        },
        remark: {
            isVisible: { list: false, filter: false, show: true, edit: true },
        },
        currency: {
            isVisible: { list: false, filter: true, show: true, edit: true },
        },
        grossamount: {
            isVisible: { list: false, filter: false, show: true, edit: true },
        },
        netamount: {
            isVisible: { list: false, filter: false, show: true, edit: false },
        },
        bankcharges: {
            isVisible: { list: false, filter: false, show: true, edit: false },
        },
        bankStatementitem: {
            isVisible: { list: false, filter: false, show: true, edit: false },
        },
        statementitems: {
            isVisible: { list: false, filter: false, show: true, edit: false }
        },
        status: {
            isVisible: { list: true, filter: true, show: true, edit: false }
        },
        isLocked: {
            isVisible: { list: true, filter: true, show: true, edit: false }
        }
    },
    actions: {
        edit: {
            actionType: 'record',
            isAccessible: (context) => {
                return true //currentAdmin not available ?
            },
        },
        import: {
            actionType: 'record',
            isVisible: true,
            component: AdminJS.bundle('../components/MiniImport'),
            handler: async(request, response, context) => {
                const { record, resource, currentAdmin } = context
                return { record: new AdminJS.BaseRecord(record.params, resource).toJSON(currentAdmin) }
            },
        },
        csvimport: {
            actionType: 'resource',
            isVisible: false,
            isAccessible: true,
            component: false,
            handler: async(request, response, context) => {
                let total = 0
                let matched = true
                let statement = await Statement.findById(request.payload.statementId)
                let newStatementItems = []
                await Promise.all(request.payload.statementitems.map(async (item) => {
                    let account = await AccountPolicy.findOne({number: item.accountnumber})
                    total = total + parseFloat(item.grossamount)
                    newStatementItems.push({
                        accountnumber: account._id,
                        grossamount: parseFloat(item.grossamount),
                        netamount: 0
                    })
                }))
                if (request.payload.grossamount && total !== request.payload.grossamount) {
                    matched = false
                } else {
                    statement.statementitems = newStatementItems
                    statement.status = 'DetailsMatched'
                    await statement.save()
                }
                if (matched) {
                    return { notice: { message: 'OK', type: 'success' } }
                } else {
                    return { notice: { message: 'Fail', type: 'error' } }
                }
            }
        },
        applycharges: {
            actionType: 'resource',
            isVisible: false,
            isAccessible: true,
            component: false,
            handler: async(request, resource, context) => {
                let statements = await Statement.find({tag: request.payload.tag})
                await Promise.all(statements.map(async (statement) => {
                    if (statement.status === 'DetailsMatched') {
                        let totalcharges = statement.bankcharges
                        let grossamount = statement.grossamount
                        statement.statementitems.forEach(item => {
                            let bankcharge = Math.round(totalcharges * (item.grossamount / grossamount) * 100)/100
                            item.netamount = item.grossamount - bankcharge
                        })
                        statement.status = 'BankFeesAllocated'
                        statement.isLocked = true
                        await statement.save()
                    }
                }))
                return { notice: { message: 'OK', type: 'success', data: [] } }    
            }
        },
        reconcile: {
            actionType: 'resource',
            isVisible: false,
            isAccessible: true,
            component: false,
            handler: async(request, response, context) => {
                let balances = await AccountLedgerBalance.find({tag: request.payload.tag})
                let statements = await Statement.find({tag: request.payload.tag})
                let transformedStatements = []
                let finalStatements = []
                let unmatched = []
                statements.forEach((statement) => {
                    transformedStatements.push({
                        items: statement.statementitems,
                        currency: statement.currency,
                        id: statement._id
                    })
                })
                transformedStatements.forEach(statement => {
                    statement.items.forEach(item => {
                        finalStatements.push({
                            accountnumber: item.accountnumber,
                            currency: statement.currency,
                            amount: item.grossamount,
                            id: item.id
                        })
                    })
                })
                await Promise.all(finalStatements.map(async (item) => {
                    let matchedRecord = balances.find(obj => obj.accountnumber.toString() === item.accountnumber.toString())
                    if (!matchedRecord) {
                        const rawAccount = await AccountPolicy.findById(item.accountnumber)
                        unmatched.push(rawAccount.number)
                    } else
                    if (matchedRecord.currency.toString() !== item.currency.toString() || matchedRecord.advisorfee !== item.amount) {
                        const rawAccount = await AccountPolicy.findById(item.accountnumber)
                        unmatched.push(rawAccount.number)
                    } else {
                        matchedRecord.reconcileStatus = [...matchedRecord.reconcileStatus, {
                            with: 'Statement',
                            lastReconcileTime: new Date(),
                            lastReconcileStatus: 'Matched',
                            link: item.id
                        }]
                        await matchedRecord.save()
                    }
                }))
                if (unmatched.length === 0) {
                    return { notice: { message: 'OK', type: 'success', data: [] } }    
                } else {
                    return { notice: { message: 'Fail', type: 'error', data: unmatched } }    
                }
            }
        },
        feesharescalc: {
            actionType: 'resource',
            isVisible: false,
            isAccessible: true,
            component: false,
            handler: async(request, resource, context) => {
                let statements = await Statement.find({tag: request.payload.tag})
                await Promise.all(statements.map(async (statement) => {
                    if (statement.status === 'BankFeesAllocated') {
                        await Promise.all(statement.statementitems.map(async (item) => {
                            const accountFeeRaw = await AccountFee.findOne({accountnumber: item.accountnumber, statementCode: statement.statementcode})
                            const feeSharingRaw = await FeeSharing.findById(accountFeeRaw.feeSharingScheme).populate('feerecipients')
                            const currenycRaw = await Currency.findById(statement.currency)
                            const periodRaw = await Period.findById(statement.period)
                            const exchRateRaw = await CurrencyHistory.findOne({currency: currenycRaw._id, date: periodRaw.end})
                            const feeSharingCalculated = [] 
                            feeSharingRaw.feerecipients.forEach(recipient => {
                                const amount = (item.netamount * ( recipient.percentage / 100 ) * exchRateRaw.rate).toFixed(2)
                                feeSharingCalculated.push({
                                    recipient: recipient.recipient,
                                    share: recipient.percentage,
                                    role: recipient.role,
                                    amount: amount
                                })
                            })
                            const feeShareHistory = new FeeSharingHistory({
                                statement: statement._id,
                                accountnumber: item.accountnumber,
                                amount: item.netamount,
                                date: new Date(),
                                tag: request.payload.tag,
                                currency: statement.currency,
                                recipientRecords: feeSharingCalculated
                            })
                            await feeShareHistory.save()
                        }))
                        statement.status = 'FeeSharingCompleted'
                        await statement.save()
                    }
                }))
                return { notice: { message: 'OK', type: 'success' } }
            }
        }
    },
}

module.exports = StatementResource