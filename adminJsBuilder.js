const mongoose = require('mongoose')
const AdminJS = require('adminjs')
const bcrypt = require('bcrypt')
const moment = require('moment')
const { parse } = require('json2csv');
const CustodianModel = require('./models/custodian.model')
const AccountCustodianModel = require('./models/account-custodian.model')
const AccountPolicyModel = require('./models/account-policy')
const CustomerModel = require('./models/customer-model')
const RoleModel = require('./models/role.model')
const AccountLedgerBalanceModel = require('./models/account-ledger-balance.model')
const FeeCodeModel = require('./models/fee-code.model')
const PayeeModel = require('./models/payee-model')
const StatementParticularModel = require('./models/statement-particular.model')
const CurrencyModel = require('./models/currency.model')
const CurrencyHistoryModel = require('./models/currency-history.model')
const FeeSharingSchemeModel = require('./models/fee-sharing.model')
const AccountFeeModel = require('./models/account-fee.model')
const PolicyFeeSettingModel = require('./models/policyfee-setting.model')
const UserModel = require('./models/user.model')
const ReportModel = require('./models/report.model')
const PeriodModel = require('./models/period-model')
const CounterPartyModel = require('./models/counterparty.model')
const StatmentModel = require('./models/statement.model')
const BankModel = require('./models/bank.model')
const BankStatementItemModel = require('./models/bankstatement-item.model')
const FeeShareHistoryModel = require('./models/feeshare-history.model')
const importExportFeature = require('./features/import-export/index')
const { jsPDF } = require('jspdf/dist/jspdf.node')
const { customRound } = require('./lib/utils');

const menu = {
    Admin: { name: 'Admin/Reports' },
    Master: { name: 'Masters' },
    Currency: { name: 'Currency' },
    Accounts: { name: 'IAM Customer Maintainence' },
    Statements: { name: 'Statement Maintainence' },
    Fees: { name: 'Fees' }
}

const getExportedFileName = (extension) =>
  `export-${moment().format('yyyy-MM-dd_HH-mm')}.${extension}`

    
const adminJsStatic = {
    databases: [mongoose],
    rootPath: '/admin',
    dashboard: {
        component: AdminJS.bundle('./components/CustomDashboard')
    },
    resources: [
        {
            resource: UserModel, options: {
                parent: menu.Admin,
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    encryptedPassword: {
                        isVisible: false
                    },
                    password: {
                        type: 'string',
                        isVisible: {
                            list: false, edit: true, filter: false, show: false,
                        }
                    }
                },
                actions: {
                    new: {
                        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
                        before: async(request) => {
                            if (request.payload.password) {
                                request.payload = {
                                    ...request.payload,
                                    encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                                    password: undefined
                                }
                            }
                            return request
                        }
                    },
                    list: {
                        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
                    },
                    edit: {
                        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
                        before: async(request) => {
                            if (request.payload.password) {
                                request.payload = {
                                    ...request.payload,
                                    encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                                    password: undefined
                                }
                            }
                            return request
                        }
                    },
                    show: {
                        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
                    },
                    filter: {
                        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
                    }
                }
            }
        },
        {
            resource: CounterPartyModel, options: {
                parent: menu.Master,
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    }
                }
            }
        },
        {
            resource: BankModel, options: {
                parent: menu.Master,
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    }
                }
            }
        },
        {
            resource: BankStatementItemModel, options: {
                parent: menu.Statements,
                actions: {
                    edit: {
                        actionType: 'record',
                        before: async(request) => {
                            console.log('Payload:',request.payload)
                            return request
                        },
                        isAccessible: ({ currentAdmin, record }) => {
                            return true
                            //return ((currentAdmin && currentAdmin.role === 'admin') || (currentAdmin && currentAdmin.role === 'user' && !record.param('isLocked')))
                        },
                    },
                    reconcile: {
                        actionType: 'resource',
                        isVisible: false,
                        isAccessible: true,
                        component: AdminJS.bundle('./components/BankReconcile'),
                        handler: async(request, resource, context) => {
                            const statementItems = await BankStatementItemModel.find({bankstatementId: request.payload.statementId}).populate('statement')
                            let unmatched = []
                            await Promise.all(statementItems.map(async (item) => {
                                const alreadyReconciled = item.statement.bankStatementitem ? true: false
                                if (!alreadyReconciled) {
                                    const sourcegrossamt = item.grossamount
                                    const targetgrossamt = item.statement.grossamount
                                    if (item.currency.toString() !== item.statement.currency.toString()) {
                                        unmatch.push(item.statement.reference)
                                    } else if (sourcegrossamt !== targetgrossamt) {
                                        unmatch.push(item.statement.reference)
                                    } else {
                                        item.isLocked = true
                                        await item.save()
                                        let statement = await StatmentModel.findById(item.statement._id)
                                        statement.bankcharges = item.bankcharges
                                        statement.netamount = item.netamount
                                        statement.bankStatementitem = item._id
                                        await statement.save()
                                    }
                                }
                            }))
                            if (unmatched.length === 0) {
                                return { notice: { message: 'OK', type: 'success', data: [] } }
                            } else {
                                return { notice: { message: 'Fail', type: 'error', data: unmatched } }
                            }   
                        }
                    }
                },
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    date: {
                        type: 'date',
                        isVisible: { list: false, filter: true, show: true, edit: true },
                    },
                    netamount: {
                        isVisible: { list: false, filter: false, show: true, edit: false },
                    },
                    party: {
                        isVisible: { list: false, filter: true, show: true, edit: true },
                    },
                    isLocked: {
                        isVisible: { list: true, filter: true, show: true, edit: false },
                    }
                }
            }
        },
        {
            resource: StatmentModel, options: {
                parent: menu.Statements,
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
                        component: AdminJS.bundle('./components/MiniImport'),
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
                            console.log(request.payload)
                            let total = 0
                            let matched = true
                            let statement = await StatmentModel.findById(request.payload.statementId)
                            let newStatementItems = []
                            await Promise.all(request.payload.statementitems.map(async (item) => {
                                let account = await AccountPolicyModel.findOne({number: item.accountnumber})
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
                        component: AdminJS.bundle('./components/ChargesApply'),
                        handler: async(request, resource, context) => {
                            let statements = await StatmentModel.find({tag: request.payload.tag})
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
                                    console.log(statement)
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
                        component: AdminJS.bundle('./components/FeeReconcile'),
                        handler: async(request, response, context) => {
                            let balances = await AccountLedgerBalanceModel.find({tag: request.payload.tag})
                            let statements = await StatmentModel.find({tag: request.payload.tag})
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
                                    const rawAccount = await AccountPolicyModel.findById(item.accountnumber)
                                    unmatched.push(rawAccount.number)
                                } else
                                if (matchedRecord.currency.toString() !== item.currency.toString() || matchedRecord.advisorfee !== item.amount) {
                                    const rawAccount = await AccountPolicyModel.findById(item.accountnumber)
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
                        component: AdminJS.bundle('./components/FeeShareCalc'),
                        handler: async(request, resource, context) => {
                            let statements = await StatmentModel.find({tag: request.payload.tag})
                            await Promise.all(statements.map(async (statement) => {
                                if (statement.status === 'BankFeesAllocated') {
                                    await Promise.all(statement.statementitems.map(async (item) => {
                                        const accountFeeRaw = await AccountFeeModel.findOne({accountnumber: item.accountnumber, statementCode: statement.statementcode})
                                        const feeSharingRaw = await FeeSharingSchemeModel.findById(accountFeeRaw.feeSharingScheme).populate('feerecipients')
                                        const currenycRaw = await CurrencyModel.findById(statement.currency)
                                        const periodRaw = await PeriodModel.findById(statement.period)
                                        const exchRateRaw = await CurrencyHistoryModel.findOne({currency: currenycRaw._id, date: periodRaw.end})
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
                                        const feeShareHistory = new FeeShareHistoryModel({
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
            },
        },
        {
            resource: PeriodModel, options: {
                parent: menu.Currency,
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    factor: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    start: {
                        type: 'date'
                    },
                    end: {
                        type: 'date'
                    }
                }
            }
        },
        { 
            resource: CustodianModel, options: { 
                parent: menu.Accounts,
                listProperties: ['name'],
                editProperties: ['name'],
                filterProperties: ['name'],
                showProperties: ['name']
            }
        },
        {
            resource: AccountPolicyModel, options: {
                parent: menu.Accounts,
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    }
                }
            }
        },
        {
            resource: ReportModel, options: {
                parent: menu.Admin,
                actions: {
                    export: {
                        actionType: 'record',
                        icon: 'Report',
                        component: AdminJS.bundle('./components/MiniExport.jsx'),
                        handler: async (request, response, context) => {
                            const { record, resource, currentAdmin } = context
                            let exportModel = record.params.source === 'AccountLedgerBalances' ? AccountLedgerBalanceModel : FeeShareHistoryModel
                            let parsed = null
                            let transformedRecords = []
                            let pdfData = null
                            let pdfDoc = null
                            let accumulateTotal = 0
                            let feeShareTotals = {}
                            let reportTypes = []
                            let docs = await exportModel.find({[record.params['filters.0.fieldname']]: record.params['filters.0.value']})
                            await Promise.all(docs.map(async (doc) => {
                                if (record.params.source === 'AccountLedgerBalances') {
                                    reportTypes = ['csv','pdf']
                                    let resultAccountPolicy = await AccountPolicyModel.findById(doc.accountnumber)
                                    let resultCurrency = await CurrencyModel.findById(doc.currency)
                                    let resultCustodian = await CustodianModel.findById(doc.custodian)
                                    let resultCustomer = await CustomerModel.findById(doc.customer)
                                    let transformedRecord = {
                                        accountnumber: resultAccountPolicy? resultAccountPolicy.number: '',
                                        NAVDate: doc.NAVDate? moment(doc.NAVDate).format('YYYY-MM-DD'): '',
                                        AUM: doc.AUM? doc.AUM: '',
                                        currency: resultCurrency? resultCurrency.name : '',
                                        advisorfee: doc.advisorfee? doc.advisorfee: '',
                                        retrocession: doc.retrocession? doc.retrocession: '',
                                        custodian: resultCustodian? resultCustodian.name : '',
                                        customer: resultCustomer? resultCustomer.clientId: ''
                                    }
                                    transformedRecords.push(transformedRecord)
                                } else if (record.params.source === 'FeeShareHistory') {
                                    reportTypes = ['pdf']
                                    let resultAccountPolicy = await AccountPolicyModel.findById(doc.accountnumber)
                                    let resultCurrency = await CurrencyModel.findById(doc.currency)
                                    let resultStatement = await StatmentModel.findById(doc.statement)
                                    let recipients = []
                                    await Promise.all(doc.recipientRecords.map(async (recipient) => {
                                        let resultRole = await RoleModel.findById(recipient.role)
                                        let resultRecipient = await PayeeModel.findById(recipient.recipient)
                                        feeShareTotals[resultRecipient.name] = feeShareTotals.hasOwnProperty(resultRecipient.name) ? feeShareTotals[resultRecipient.name] + recipient.amount : recipient.amount
                                        recipients.push([resultRecipient.name, resultRole.name, customRound(recipient.share), customRound(recipient.amount),'HKD'])
                                    }))
                                    accumulateTotal = accumulateTotal + doc.amount
                                    let transformedRecord = {
                                        accountnumber: resultAccountPolicy? resultAccountPolicy.number: '',
                                        statement: resultStatement.reference,
                                        recordDate: moment(doc.date).format('YYYY-MM-DD'),
                                        totalAmount: doc.amount,
                                        currency: resultCurrency? resultCurrency.name : '',
                                        recipientRecords: recipients
                                    }
                                    transformedRecords.push(transformedRecord)
                                    const { applyPlugin } = require('./lib/jspdf.plugin.autotable')
                                    applyPlugin(jsPDF)
                                    pdfDoc = new jsPDF()
                                    pdfDoc.text('Fees Report', 14, 20)
                                    transformedRecords.forEach(record => {
                                        pdfDoc.autoTable({
                                            styles: {
                                                fontSize: 10
                                            },
                                            startY: pdfDoc.lastAutoTable.finalY + 10 || 30,
                                            head: [['Policy#','Statement','Date','Amount','Currency']],
                                            columnStyles: {
                                                3: { halign: 'left' }
                                            },
                                            body: [[record.accountnumber, record.statement, moment(record.recordDate).format('YYYY-MM-DD'), customRound(record.totalAmount), record.currency]]
                                        })
                                        pdfDoc.autoTable({
                                            styles: {
                                                fontSize: 8
                                            },
                                            headStyles: {
                                                fillColor: '#E4A2C6'
                                            },
                                            startY: pdfDoc.lastAutoTable.finalY + 10,
                                            head: [['Name','Role','Share(%)','Amount','Currency']],
                                            columnStyles: {
                                                3: { halign: 'left' }
                                            },
                                            body: record.recipientRecords
                                        })
                                    })
                                }                            
                            }))
                            if (reportTypes.includes('csv')) {
                                parsed = parse(transformedRecords)          
                            } 
                            if (reportTypes.includes('pdf') && record.params.source === 'AccountLedgerBalances') {
                                const { applyPlugin } = require('./lib/jspdf.plugin.autotable')
                                applyPlugin(jsPDF)
                                pdfDoc = new jsPDF()
                                pdfDoc.text('Advisor Fees Report', 14, 20)
                                pdfDoc.autoTable({
                                    startY: 35,
                                    head: [['Policy Number', 'Advisor Fees Amount']],
                                    body: transformedRecords.map(rec => [rec.accountnumber, customRound(rec.advisorfee)])
                                })
                                pdfDoc.text('Retrocession Fees Report', 14, pdfDoc.lastAutoTable.finalY + 15)
                                pdfDoc.autoTable({
                                    startY: pdfDoc.lastAutoTable.finalY + 30,
                                    head: [['Policy Number', 'Retrocession Amount']],
                                    body: transformedRecords.filter(item => {return item.retrocession && item.retrocession > 0}).map(rec => [rec.accountnumber, customRound(rec.retrocession)])
                                })
                                pdfData = pdfDoc.output()
                            }
                            if (reportTypes.includes('pdf') && record.params.source === 'FeeShareHistory') {
                                let feeShareList = []
                                for (key in feeShareTotals) {
                                    feeShareList.push([key, customRound(feeShareTotals[key])])
                                }
                                pdfDoc.text('Summary', 14, pdfDoc.lastAutoTable.finalY + 15)
                                pdfDoc.autoTable({
                                    startY: pdfDoc.lastAutoTable.finalY + 25,
                                    styles: {
                                        fontSize: 10
                                    },
                                    headStyles: {
                                        fillColor: '#5E5E5E'
                                    },
                                    head: [['Name','Total']],
                                    body: feeShareList
                                })
                                pdfData = pdfDoc.output()
                            }
                            return { 
                                record: new AdminJS.BaseRecord({csvData: parsed, pdfData: pdfData, reportTypes: JSON.stringify(reportTypes)}, resource).toJSON(currentAdmin)
                            }
                        }
                    }
                },
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    }
                }
            }
        },
        {
            resource: AccountCustodianModel, options: {
                parent: menu.Accounts,
                listProperties: ['accountPolicyNumber', 'custodian'],
                editProperties: ['accountPolicyNumber', 'custodian'],
                filterProperties: ['accountPolicyNumber', 'custodian'],
                showProperties: ['accountPolicyNumber', 'custodian'],
            }
        },
        {
            resource: CustomerModel, options: {
                parent: menu.Accounts,
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    clientId: {
                        isTitle: true,
                        isVisible: { list: true, filter: true, show: true, edit: false },
                    },
                    bankaccountnumber: {
                        isVisible: { list: false, filter: true, show: true, edit: true },
                    },
                    address: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    mobile: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    email: {
                        isVisible: { list: false, filter: true, show: true, edit: true },
                    }
                }
            }
        },
        {
            resource: RoleModel, options: {
                parent: menu.Master,
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    }
                }
            }
        },
        {
            resource: AccountLedgerBalanceModel, options: {
                parent: menu.Accounts,
                actions: {
                    new: {
                        before: async (request, context) => {
                            const { currentAdmin } = context
                            if (request.payload) {
                                request.payload = {
                                    ...request.payload,
                                    lastModifiedBy: currentAdmin._id
                                }
                            }
                            return request
                        }
                    },
                    edit: {
                        actionType: 'record',
                        isAccessible: ({ currentAdmin, record }) => {
                            return true
                            //return ((currentAdmin && currentAdmin.role === 'admin') || (currentAdmin && currentAdmin.role === 'user' && !record.param('isLocked')))
                        },
                        before: async (request, context) => {
                            const { currentAdmin, record } = context
                            if (request.payload && currentAdmin) {
                                request.payload = {
                                    ...request.payload,
                                    lastModifiedBy: currentAdmin._id
                                }
                            } 
                            return request
                        }
                    },
                    delete: {
                        actionType: 'record',
                        isAccessible: ({ currentAdmin, record }) => {
                            return ((currentAdmin && currentAdmin.role === 'admin') || (currentAdmin && currentAdmin.role === 'user' && !record.param('isLocked')))
                        },
                    },
                    import: {
                        actionType: 'resource',
                        isVisible: true,
                        handler: async(request, response, data) => {
                            try {
                                let records = JSON.parse(request.payload.payload)
                                records.forEach(record => {
                                    AccountPolicyModel.findOne({number: record.accountnumber}, async (err, doc) => {
                                        record.accountnumber = doc._id,
                                        record.AUM = parseFloat(record.AUM),
                                        record.NAVDate = new Date(record.NAVDate)
                                        record.currency = doc.currency
                                        const ledgerRecord = new AccountLedgerBalanceModel(record)
                                        await ledgerRecord.save()
                                    })                  
                                })
                                return {
                                    notice: {
                                        message: 'OK',
                                        type: 'success'
                                    }
                                }
                            } catch (err) {
                                return {
                                    notice: {
                                        message: 'Fail',
                                        type: 'error'
                                    }
                                }
                            }                                       
                        }
                    }
                },
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    accountnumber: {
                        isVisible: { list: true, filter: true, show: true, edit: true },
                    },
                    NAVDate: {
                        type: 'date',
                        isVisible: { list: true, filter: true, show: true, edit: true },
                    },
                    tag: {
                        isVisible: { list: true, filter: true, show: true, edit: true },
                    },
                    AUM: {
                        isVisible: { list: true, filter: false, show: true, edit: true },
                    },
                    currency: {
                        isVisible: { list: true, filter: true, show: true, edit: true },
                    },
                    estimatedfee: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    overrideAdvisorFee: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    advisorfee: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    retrocession: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    lastModifiedBy: {
                        isVisible: { list: false, filter: false, show: true, edit: false },
                    },
                    lastModifiedTime: {
                        isVisible: { list: false, filter: false, show: true, edit: false },
                    },
                    isLocked: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    reconcileStatus: {
                        isVisible: { list: false, filter: false, show: true, edit: false },
                    }
                },
            },
            features: [importExportFeature()]
        },
        {
            resource: PolicyFeeSettingModel, options: {
                parent: menu.Fees,
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    accountnumber: {
                        isVisible: { list: true, filter: true, show: true, edit: true },
                    },
                    custodian: {
                        isVisible: { list: true, filter: true, show: true, edit: true },
                    },
                    accountopendate: {
                        type: 'date',
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    accountenddate: {
                        type: 'date',
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    accountstatus: {
                        isVisible: { list: true, filter: true, show: true, edit: true },
                    },
                    discretionarymanage: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    advisorfee: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    retrocession: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    }
                }
            }
        },
        {
            resource: FeeCodeModel, options: {
                parent: menu.Fees,
                listProperties: ['code', 'value', 'comment'],
                editProperties: ['code', 'value', 'comment'],
                filterProperties:  ['code', 'value', 'comment'],
                showProperties:  ['code', 'value', 'comment']
            }
        },
        { 
            resource: PayeeModel, options: { 
                parent: menu.Master,
                properties: {
                    _id : {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    }
                }
            }
        },
        { 
            resource: StatementParticularModel, options: { 
                parent: menu.Statements,
                listProperties: ['name'],
                editProperties: ['name'],
                filterProperties: ['name'],
                showProperties: ['name']
            }
        },
        { 
            resource: CurrencyModel, options: { 
                properties: {
                    mimeType: {}
                },
                parent: menu.Currency,
                listProperties: ['name'],
                editProperties: ['name'],
                filterProperties: ['name'],
                showProperties: ['name'],
            },
        },
        { 
            resource: CurrencyHistoryModel, options: { 
                parent: menu.Currency,
                properties: {
                    date: {
                        type: 'date'
                    }
                },
                listProperties: ['currency','date','rate'],
                editProperties: ['currency','date','rate'],
                filterProperties: ['currency','date','rate'],
                showProperties: ['currency','date','rate']
            }
        },
        {
            resource: FeeSharingSchemeModel, options: {
                parent: menu.Fees,
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    feerecipients: {
                        isVisible: { list: false, filter: false, show: true, edit: true }
                    }
                }
            }
        },
        {
            resource: AccountFeeModel, options: {
                parent: menu.Fees,
                properties: {
                    startDate: {
                        type: 'date'
                    },
                    endDate: {
                        type: 'date'
                    }
                },
                listProperties: ['accountnumber','statementCode','startDate','endDate','feeSharingScheme'],
                editProperties: ['accountnumber','statementCode','startDate','endDate','feeSharingScheme'],
                filterProperties: ['accountnumber','statementCode','startDate','endDate','feeSharingScheme'],
                showProperties: ['accountnumber','statementCode','startDate','endDate','feeSharingScheme']
            }
        },
        {
            resource: FeeShareHistoryModel, options: {
                parent: menu.Fees,
                actions: {
                    new: {
                        actionType: 'record',
                        isAccessible: false
                    },
                    edit: {
                        actionType: 'record',
                        isAccessible: false
                    },
                    delete: {
                        actionType: 'record',
                        isAccessible: false
                    },
                    bulkDelete: {
                        actionType: 'resource',
                        isAccessible: false
                    }
                },
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    }
                }
            }
        }
    ],
    version: {
        admin: true,
        app: '1.0.0'
    },
    branding: {
        logo: 'https://oh-estore.s3.amazonaws.com/AOCLogo.png',
        companyName: 'I-AMS',
        softwareBrothers: false,
    },
    locale: {
        translations: {
            messages: {
                loginWelcome: 'Integrated Asset Management System'
            },
            labels: {
                loginWelcome: 'I-AMS',
                CurrencyHistory: 'Currency Histories',
                Currency: 'Currencies',
                Period: 'Report Periods',
                CounterParty: 'Custodians',
                Bank: 'Settlement Banks',
                Role: 'Company Roles',
                User: 'Portal Users',
                Report: 'Reports',
                Custodian: 'Custodians',
                Customer: 'Customers',
                Statement: 'Custodian Statements',
                StatementParticular: 'Custodian Particulars',
                Payee: 'Company Payees',
                BankStatementItem: 'Bank Statements',
                AccountPolicy: 'Customer Policy Settings',
                AccountLedgerBalance: 'Account Ledger Balances',
                AccountCustodian: 'Custodian Policy Settings',
                FeeShareHistory: 'Fee Shares Results',
                FeeCode: 'Fee Codes Maintainence',
                PolicyFeeSetting: 'Policy Fees Setting',
                FeeSharingScheme: 'Fee Share Schemes',
                AccountFee: 'Statement Particular Fee Sharing Settings'
            },
            properties: {
                email: 'User Id'
            },
            resources: {
                Customer: {
                    properties: {
                        bankaccountnumber: 'Bank Account #'
                    }
                },
                AccountFee: {
                    properties: {
                        accountnumber: 'Account Number',
                        statementCode: 'Statement Particular Code'
                    }
                },
                FeeCode: {
                    properties: {
                        value: 'Value (%)'
                    }
                },
                AccountPolicy: {
                    properties: {
                        number: 'Account Number / Policy Number'
                    }
                },
                AccountCustodian: {
                    properties: {
                        accountPolicyNumber: 'Account Number / Policy Number'
                    }
                },
                PolicyFeeSetting: {
                    properties: {
                        accountnumber: 'Account Number / Policy Number',
                        accountstatus: 'Account Status',
                        accountopendate: 'Account Opening Date',
                        accountenddate: 'Account Ending Date',
                        discretionarymanage: 'Discretionary Management',
                        advisorfee: 'Mgt/Advisory p.a. Fee (%)',
                        retrocession: 'Retrocession p.a. (%)'
                    }
                },
                AccountLedgerBalance: {
                    properties: {
                        accountnumber: 'Account Number / Policy Number',
                        estimatedfee: 'Estimated Fees (%)',
                        advisorfee: 'Mgt/Advisory Fee p.a',
                        retrocession: 'Retrocession p.a.'
                    }
                },
                FeeSharingScheme: {
                    properties: {
                        code: 'Fee Sharing Code',
                        feerecipients: 'Fee Recipients',
                        'feerecipients.recipient': 'Name',
                        'feerecipients.percentage': 'Share (%)',
                        'feerecipients.role': 'Role'
                    }
                },
            }
        }
    }
}

module.exports = { adminJsStatic, menu }