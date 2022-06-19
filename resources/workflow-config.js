const AdminJS = require('adminjs')
const stages = require('../config/stages.template')
const Period = require('../models/period-model')
const mongoose = require('mongoose')
const { jsPDF } = require('jspdf/dist/jspdf.node')
const moment = require('moment')

const getPropByString = (obj, propString) => {
    if (!propString)
      return obj;
    let prop, props = propString.split('.');
    for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
      prop = props[i]
      let candidate = obj[prop]
      if (candidate !== undefined) {
        obj = candidate
      } else {
        break
      }
    }
    return obj[props[i]]
}
  

const WorkflowConfigResource = {
    id: 'Workflow Configuration',
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        createdAt: {
            isVisible: { list: false, filter: false, show: true, edit: false },
            position: 100
        },
        subPeriodEndDates: {
            isVisible: { list: false, filter: false, show: false, edit: false }
        },
        createdBy: {
            isVisible: { list: false, filter: false, show: true, edit: false },
            position: 101
        },
        isCurrent: {
            isVisible: { list: true, filter: true, show: true, edit: false },
            position: 1
        },
        period: {
            isVisible: true,
            position: 2
        },
        status: {
            isVisible: { list: true, filter: true, show: true, edit: false },
            position: 3
        },
        stages: {
            isVisible: false
        },
        currentStage: {
            isVisible: false
        }
    },
    actions: {
        new: {
            before: async (request, context) => {
                const { resource, currentAdmin } = context
                resource.MongooseModel.findOneAndUpdate({
                    isCurrent: true
                }, {
                    isCurrent: false
                }, (err, doc, res) => {
                    if (err) {
                        console.log('Err:',err)
                    } else {
                        console.log('Res:',res)
                    }
                })
                let period = await Period.findById(request.payload.period)
                request.payload = {
                    ...request.payload,
                    createdBy: currentAdmin.id,
                    createdAt: new Date(),
                    isCurrent: true,
                    currentStage: 1,
                    stages: stages,
                    subPeriodEndDates: period.subPeriodEndDates
                }
                return request
            },
            isAccessible: ({ currentAdmin }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin' || currentAdmin.role === 'user'
                )
            },
            showInDrawer: true
        },
        advance: {
            actionType: 'record',
            component: false,
            isVisible: false,
            handler: async(request, response, context) => {
                const { record, resource, currentAdmin } = context
                let nextStage = record.params.currentStage + 1
                await record.update({currentStage: nextStage})
                return { 
                    record: record.toJSON(currentAdmin),
                }
            }
        },
        bankchargecalc: {
            actionType: 'record',
            component: false,
            isVisible: false,
            handler: async(request, response, context) => {
                const { record, currentAdmin } = context
                let period = require('adminjs').flat.get(record.populated.period.params)
                let statementItemModel = mongoose.connection.models['StatementItem']
                let bankStatementItemModel = mongoose.connection.models['BankStatementItem']
                let currencyPairModel = mongoose.connection.models['CurrencyPair']
                let currencyModel = mongoose.connection.models['Currency']
                let currencyHKD = await currencyModel.findOne({name: 'HKD'})
                let bankStatementItems = await bankStatementItemModel.find({
                    period: period._id,
                    status: 'approved',
                    isLocked: false
                }).populate({path: 'matchedStatement', populate: {path: 'details'}})
                await Promise.all(bankStatementItems.map(async (bankStatementItem) => {
                    let statementCurrency = bankStatementItem.currency
                    let currencyPair = await currencyPairModel.findOne({
                        base: currencyHKD._id,
                        quote: statementCurrency
                    })
                    let exchRate = period.exchangeRates.find(exchangeRate => exchangeRate.currencyPair === currencyPair._id.toString())
                    let totalGross = bankStatementItem.grossAmount
                    let statementDetails = bankStatementItem.matchedStatement.details
                    await Promise.all(statementDetails.map(async (detail) => {
                        let charge = Math.round(100 * (bankStatementItem.itemCharge * (detail.amount / totalGross)),2)/100
                        let netAmount = Math.round(100 * (detail.amount - charge),2)/100
                        await statementItemModel.findByIdAndUpdate(detail._id, {
                            reconcilation: {
                                completed: true,
                                netAmount: netAmount,
                                bankCharge: charge,
                                payableInHKD: Math.round(100 * (netAmount * exchRate.value),2)/100
                            }
                        })
                    }))
                    await bankStatementItemModel.findByIdAndUpdate(bankStatementItem._id, {isLocked: true})
                }))
                return { record: record.toJSON(currentAdmin),}
            }
        },
        feedist: {
            actionType: 'record',
            component: false,
            isVisible: false,
            handler: async(request, response, context) => {
                const { record, resource, currentAdmin } = context
                let statementItemModel = mongoose.connection.models['StatementItem']
                let feeShareResultModel = mongoose.connection.models['FeeShareResult']
                let currencyModel = mongoose.connection.models['Currency']
                let recipientFeeShareModel = mongoose.connection.models['RecipientFeeShare']
                let currencyHKD = await currencyModel.findOne({name: 'HKD'})
                let statementItems = await statementItemModel.find({
                    period: currentAdmin.period,
                    'reconcilation.completed': true
                }).populate({path: 'custodianAccount', populate: {path: 'feeSharing', populate: {path: 'feeSharingScheme'}}})
                let recipientShare = {}
                await feeShareResultModel.remove({
                    period: currentAdmin.period
                })
                await Promise.all(statementItems.map(async (item) => {
                    let result = {}
                    result.statementItem = item._id.toString()
                    result.period = currentAdmin.period
                    result.amount = item.reconcilation.payableInHKD
                    result.custodianAccount = item.custodianAccount._id.toString()
                    result.currency = currencyHKD._id.toString()
                    result.type = item.type
                    result.feeShares = []
                    item.custodianAccount.feeSharing.forEach(share => {
                        if (item.type === share.feeType) {
                            share.feeSharingScheme.feerecipients.forEach(feeRecipient => {
                                result.feeShares.push({
                                    recipient: feeRecipient.recipient.toString(),
                                    role: feeRecipient.role.toString(),
                                    amount: Math.round(100 * result.amount * (feeRecipient.percentage/100), 2)/100,
                                    share: feeRecipient.percentage
                                })
                                if (!recipientShare.hasOwnProperty(feeRecipient.recipient.toString())) {
                                    recipientShare[feeRecipient.recipient.toString()] = {
                                        recipient: feeRecipient.recipient.toString(),
                                        period: currentAdmin.period,
                                        currency: currencyHKD._id.toString(),
                                        details: []
                                    }
                                }
                                recipientShare[feeRecipient.recipient.toString()].details.push({
                                    custodianAccount: item.custodianAccount._id.toString(),
                                    role: feeRecipient.role.toString(),
                                    amount: Math.round(100 * result.amount * (feeRecipient.percentage/100), 2)/100,
                                    type: item.type
                                })
                            })
                        }
                    })
                    const fShareResult = new feeShareResultModel(result)
                    await fShareResult.save()
                }))
                await recipientFeeShareModel.remove({
                    period: currentAdmin.admin
                })
                await Promise.all(Object.keys(recipientShare).map(async (recipient) => {
                    let rShare = recipientShare[recipient]
                    const rShareResult = new recipientFeeShareModel(rShare)
                    await rShareResult.save()
                }))
                return { record: record.toJSON(currentAdmin),}
            }
        },
        gendnote: {
            actionType: 'record',
            component: false,
            isVisible: false,
            handler: async(request, response, context) => {
                const { record, resource, currentAdmin } = context
                let currentStage = record.params.currentStage
                let tmpRecord = require('adminjs').flat.get(record.params)
                let period = require('adminjs').flat.get(record.populated.period.params)
                let statementItemModel = mongoose.connection.models['StatementItem']
                let accountPolicyModel = mongoose.connection.models['AccountPolicy']
                let custodianStatementModel = mongoose.connection.models['CustodianStatement']
                let feeCodeModel = mongoose.connection.models['FeeCode']
                let statementSummaryModel = mongoose.connection.models['StatementSummary']
                let allTags = []
                let endDate = tmpRecord.subPeriodEndDates[currentStage-1]
                await statementItemModel.remove({period: currentAdmin.period})
                await statementSummaryModel.remove({period: currentAdmin.period})
                let customerPortfolioRecords = await custodianStatementModel.find({
                    period: period,
                    statementDate: endDate,
                    status: 'approved'
                })
                await Promise.all(customerPortfolioRecords.map(async (pRecord) => {
                    let statementItem = {}
                    let accountPolicy = await accountPolicyModel.findById(pRecord.custodianAccount).populate('custodian')
                    let feeCode = accountPolicy.feeCode
                    let feeRate = await feeCodeModel.findById(feeCode)
                    let factor = 1
                    let isFull = true
                    if (moment(accountPolicy.accountStartDate).diff(moment(period.start)) > 0) {
                        isFull = false
                    }
                    if (isFull) {
                        factor = period.factor * ( feeRate.value / 100 )
                    } else {
                        let start = moment(accountPolicy.accountStartDate)
                        let end = moment(endDate)
                        let days = moment.duration(end.diff(start)).asDays()
                        let isLeapYear = moment().isLeapYear()
                        let newFactor = isLeapYear ? days / 366 : days / 365
                        factor = newFactor * ( feeRate.value / 100 )
                    }
                    statementItem.custodianAccount = pRecord.custodianAccount
                    statementItem.amount = Math.round(100 * factor * pRecord.total, 2)/100
                    statementItem.currency = accountPolicy.currency
                    statementItem.type = 'ManagementFee'
                    statementItem.period = period._id
                    statementItem.reconcilation = { completed: false }
                    statementItem.tag = `${(period.name).replace(' ','')}-${(accountPolicy.custodian.name).replace(' ','')}-DemandNote`
                    allTags.push(statementItem.tag)
                    const newStatementItem = new statementItemModel(statementItem)
                    await newStatementItem.save()
                }))
                let tags = [...new Set(allTags)]
                await Promise.all(tags.map(async (tag) => {
                    let total = 0
                    let statementItems = await statementItemModel.find({tag: tag}).populate({path: 'custodianAccount', populate: {path: 'custodian'}})
                    let statementItemsCurrencies = statementItems.map(item => item.currency.toString())
                    let statementItemsCustodians = statementItems.map(item => item.custodianAccount.custodian.id.toString())
                    let currencies = [...new Set(statementItemsCurrencies)]
                    let custodians = [...new Set(statementItemsCustodians)]
                    if (currencies.length === 1 && custodians.length === 1) {
                        statementItems.forEach(item => {
                            total = total + item.amount
                        })
                        total = Math.round(100 * total, 2)/100
                        const newStatementSummary = new statementSummaryModel({
                            name: tag,
                            sum: total,
                            status: 'pending',
                            currency: currencies[0],
                            type: 'ManagementFee',
                            period: period._id,
                            custodian: custodians[0],
                            details: statementItems
                        })
                        await newStatementSummary.save()
                    }
                }))
                return { 
                    record: record.toJSON(currentAdmin),
                }
            }
        },
        showgraph: {
            actionType: 'record',
            component: false,
            isVisible: false,
            handler: async(request, response, context) => {
                const { record, resource, currentAdmin } = context
                let period = require('adminjs').flat.get(record.populated.period.params)
                let recipientFeeShareModel = mongoose.connection.models['RecipientFeeShare']
                let recipientFeeShares = await recipientFeeShareModel.find({period: period._id}).populate({path: 'recipient'})
                let graphData = []
                recipientFeeShares.forEach((feeShare,idx) => {
                    graphData.push({
                        recipient: feeShare.recipient.name,
                        amount: feeShare.total
                    })
                })
                return { record: new AdminJS.BaseRecord({graphData: graphData}, resource).toJSON(currentAdmin) }
            }
        },
        printdist: {
            actionType: 'record',
            component: false,
            isVisible: false,
            handler: async(request, response, context) => {
                const { record, resource, currentAdmin } = context
                let period = require('adminjs').flat.get(record.populated.period.params)
                let recipientFeeShareModel = mongoose.connection.models['RecipientFeeShare']
                let recipientFeeShares = await recipientFeeShareModel.
                                         find({period: period._id})
                                         .populate({path: 'currency'})
                                         .populate({path: 'recipient'})
                                         .populate({path: 'details', populate: [{path: 'custodianAccount', populate: {path: 'customer'}}]})
                
                let pdfData = null
                let pdfDoc = null
                const { applyPlugin } = require('../lib/jspdf.plugin.autotable')
                applyPlugin(jsPDF)
                pdfDoc = new jsPDF()
                recipientFeeShares.forEach((feeShare,idx) => {
                    pdfDoc.setFontSize(12)
                    pdfDoc.text(`${period.name}`, 14, 20)
                    pdfDoc.text(`${feeShare.recipient.name}`, 14, 30)
                    pdfDoc.text(`Total: ${feeShare.currency.name} ${feeShare.total}`, 14, 40)
                    pdfDoc.autoTable({
                        styles: {
                            fontSize: 10
                        },
                        startY: 50,
                        head: [['Customer','Custodian Account','Type','Amount']],
                        columnStyles: {
                            3: { halign: 'left' }
                        },
                        body: feeShare.details.
                              sort((a,b) => {
                                if (a.custodianAccount.customer.clientId > b.custodianAccount.customer.clientId) {
                                    return 1
                                }
                                if (a.custodianAccount.customer.clientId < b.custodianAccount.customer.clientId) {
                                    return -1
                                }
                                return 0
                              }).
                              map(record => ([record.custodianAccount.customer.clientId, record.custodianAccount.accountNumber, record.type, record.amount]))
                    })
                    if (idx < recipientFeeShares.length - 1) {
                        pdfDoc.addPage('a4')
                    }
                })

                pdfData = pdfDoc.output()
                return { 
                    record: new AdminJS.BaseRecord({pdfData: pdfData}, resource).toJSON(currentAdmin)
                }
            }
        },
        printdn: {
            actionType: 'record',
            component: false,
            isVisible: false,
            handler: async(request, response, context) => {
                const { record, resource, currentAdmin } = context
                let period = require('adminjs').flat.get(record.populated.period.params)
                let statementSummaryModel = mongoose.connection.models['StatementSummary']
                let periodEnd = period.end
                let statementItems = await statementSummaryModel.
                                     find({period: period._id, type: 'ManagementFee'}).
                                     populate({path:'currency'}).
                                     populate({path:'custodian'}).
                                     populate({path: 'details', populate: {path: 'custodianAccount'}})
                let pdfData = null
                let pdfDoc = null
                const { applyPlugin } = require('../lib/jspdf.plugin.autotable')
                applyPlugin(jsPDF)
                pdfDoc = new jsPDF()
                statementItems.forEach((item,idx) => {
                    pdfDoc.setFontSize(12)
                    pdfDoc.text(`${moment(periodEnd).format('YYYY-MM-DD')}`, 14, 10)
                    pdfDoc.text(`${item.custodian.name} (${item.currency.name})`, 14, 20)
                    pdfDoc.autoTable({
                        styles: {
                            fontSize: 10
                        },
                        startY: 30,
                        head: [['Account','Amount']],
                        columnStyles: {
                            3: { halign: 'left' }
                        },
                        body: item.details.map(record => ([record.custodianAccount.accountNumber, record.amount]))
                    })
                    pdfDoc.setFontSize(12)
                    pdfDoc.text(`Total:        ${item.sum}`, 102, pdfDoc.lastAutoTable.finalY + 10)
                    if (idx < Object.keys(statementItems).length - 1) {
                        pdfDoc.addPage('a4')
                    }
                })
                pdfData = pdfDoc.output()
                return { 
                    record: new AdminJS.BaseRecord({pdfData: pdfData}, resource).toJSON(currentAdmin)
                }
            }
        },
        genuperf: {
            actionType: 'record',
            component: false,
            isVisible: false,
            handler: async(request, response, context) => {
                const { record, resource, currentAdmin } = context
                let currentStage = record.params.currentStage
                let tmpRecord = require('adminjs').flat.get(record.params)
                let endDate = tmpRecord.subPeriodEndDates[currentStage-1]
                let period = require('adminjs').flat.get(record.populated.period.params)
                let portfolioModel = mongoose.connection.models['CustomerUnitizedPerformance']
                let customerModel = mongoose.connection.models['CustomerPortfolio']
                let custodianStatementModel = mongoose.connection.models['CustodianStatement']
                let customerTransModel = mongoose.connection.models['CustomerTransaction']
                let periodModel = mongoose.connection.models['Period']
                let currencyPairModel = mongoose.connection.models['CurrencyPair']
                let periodRecord = await periodModel.findById(currentAdmin.period).populate({path: 'exchangeRates', populate: {path: 'currencyPair'}})     
                let customerPortfolioRecords = await customerModel.find({startDate: {$lte: endDate}})
                await portfolioModel.remove({
                    period: currentAdmin.period,
                    currentSubPeriodDate: endDate
                })
                    
                await Promise.all(customerPortfolioRecords.map(async (pRecord) => {
                    let newCustomerUnitizedRecord = {}
                    let prevUnitizedRecord = await portfolioModel.find({customer: pRecord.customer}).sort({currentSubPeriodDate:-1}).limit(1)
                    newCustomerUnitizedRecord.customer = pRecord.customer
                    newCustomerUnitizedRecord.period = currentAdmin.period
                    newCustomerUnitizedRecord.currentSubPeriodDate = endDate
                    let shouldSkip = false
                    if (prevUnitizedRecord.length === 0) {
                        newCustomerUnitizedRecord.lastSubPeriodUnit = pRecord.startUnit
                        newCustomerUnitizedRecord.lastSubPeriodNAV = pRecord.startNAV
                        newCustomerUnitizedRecord.lastSubPeriodDate = period.start    
                    } else {
                        if (moment(prevUnitizedRecord[0].currentSubPeriodDate).diff(moment(endDate)) >= 0) {
                            shouldSkip = true
                        }
                        newCustomerUnitizedRecord.lastSubPeriodUnit = prevUnitizedRecord[0].currentSubPeriodUnit
                        newCustomerUnitizedRecord.lastSubPeriodNAV = prevUnitizedRecord[0].currentSubPeriodNAV
                        newCustomerUnitizedRecord.lastSubPeriodDate = prevUnitizedRecord[0].currentSubPeriodDate
                    }
                    if (!shouldSkip) {
                        let total = 0
                        await Promise.all(pRecord.accountPolicyNumber.map(async (account) => {
                            let assetAllocationRecord = await custodianStatementModel.findOne({statementDate: endDate, status: 'approved', custodianAccount: account})
                            if (assetAllocationRecord) {
                                let exRate = 1
                                let exRateRecord = periodRecord.exchangeRates.find(exRate => exRate.currencyPair.base.toString() === pRecord.currency.toString() && exRate.currencyPair.quote.toString() === assetAllocationRecord.currency.toString())
                                if (!exRateRecord) {
                                    let defaultRecord = await currencyPairModel.findOne({base: pRecord.currency, quote: assetAllocationRecord.currency})
                                    exRate = defaultRecord.defaultValue
                                } else {
                                    exRate = exRateRecord.value
                                }
                                total = total + assetAllocationRecord.total * exRate
                            }               
                        }))
                        
                        let totalDeposit = 0
                        let totalWithdraw = 0
                        let startNAVPerUnit = pRecord.startNAV/pRecord.startUnit
                        let CustomerTransactionRecords = await customerTransModel.find({date: {$lte: endDate, $gt: newCustomerUnitizedRecord.lastSubPeriodDate}, status: 'approved', customer: pRecord.customer})
                        await Promise.all(CustomerTransactionRecords.map(async (tran) => {
                            let exRate = 1
                            let exRateRecord = periodRecord.exchangeRates.find(exRate => exRate.currencyPair.base.toString() === pRecord.currency.toString() && exRate.currencyPair.quote.toString() === tran.currency.toString())
                            if (tran.transactionType === 'deposit') {
                                if (!exRateRecord) {
                                    let defaultRecord = await currencyPairModel.findOne({base: pRecord.currency, quote: tran.currency})
                                    exRate = defaultRecord.defaultValue
                                } else {
                                    exRate = exRateRecord.value
                                }
                                totalDeposit = totalDeposit + tran.nominalValue * exRate
                                if (tran.isSeedMoney) {
                                    startNAVPerUnit = totalDeposit / tran.subscribeUnitNumber
                                }
                            } else if (tran.transactionType === 'withdraw') {
                                if (!exRateRecord) {
                                    let defaultRecord = await currencyPairModel.findOne({base: pRecord.currency, quote: tran.currency})
                                    exRate = defaultRecord.defaultValue
                                } else {
                                    exRate = exRateRecord.value
                                }
                                totalWithdraw = totalWithdraw + tran.nominalValue * exRate
                            }
                        }))
                        newCustomerUnitizedRecord.currentSubPeriodDeposited = Math.round(100*totalDeposit,2)/100
                        newCustomerUnitizedRecord.currentSubPeriodWithdrawn = Math.round(100*totalWithdraw,2)/100
                        if (prevUnitizedRecord.length === 0) {
                            newCustomerUnitizedRecord.currentSubPeriodUnitsDeposited = Math.round(10000*newCustomerUnitizedRecord.currentSubPeriodDeposited / startNAVPerUnit,4)/10000
                            newCustomerUnitizedRecord.currentSubPeriodUnitsWithdrawn = Math.round(10000*newCustomerUnitizedRecord.currentSubPeriodWithdrawn / startNAVPerUnit,4)/10000
                        } else {
                            newCustomerUnitizedRecord.currentSubPeriodUnitsDeposited = Math.round(10000*newCustomerUnitizedRecord.currentSubPeriodDeposited / prevUnitizedRecord[0].currentSubPeriodNAVPerUnit,4)/10000
                            newCustomerUnitizedRecord.currentSubPeriodUnitsWithdrawn = Math.round(10000*newCustomerUnitizedRecord.currentSubPeriodWithdrawn / prevUnitizedRecord[0].currentSubPeriodNAVPerUnit,4)/10000    
                        }
                        newCustomerUnitizedRecord.currentSubPeriodNAV = Math.round(total*100,2)/100
                        newCustomerUnitizedRecord.currentSubPeriodUnit = newCustomerUnitizedRecord.lastSubPeriodUnit - newCustomerUnitizedRecord.currentSubPeriodUnitsWithdrawn + newCustomerUnitizedRecord.currentSubPeriodUnitsDeposited
                        newCustomerUnitizedRecord.currentSubPeriodNAVPerUnit = Math.round(100* total / newCustomerUnitizedRecord.currentSubPeriodUnit,2)/100
                        newCustomerUnitizedRecord.netChange = Math.round(100*((newCustomerUnitizedRecord.currentSubPeriodNAV - newCustomerUnitizedRecord.lastSubPeriodNAV) - newCustomerUnitizedRecord.currentSubPeriodDeposited + newCustomerUnitizedRecord.currentSubPeriodWithdrawn),2)/100
                        if (prevUnitizedRecord.length === 0) {
                            newCustomerUnitizedRecord.unitizedChange = Math.round(1000*(100*(newCustomerUnitizedRecord.currentSubPeriodNAVPerUnit - startNAVPerUnit) / startNAVPerUnit),3)/1000
                        } else {
                            newCustomerUnitizedRecord.unitizedChange = Math.round(1000*(100*(newCustomerUnitizedRecord.currentSubPeriodNAVPerUnit - prevUnitizedRecord[0].currentSubPeriodNAVPerUnit) / prevUnitizedRecord[0].currentSubPeriodNAVPerUnit),3)/1000
                        }
                        newCustomerUnitizedRecord.status = 'pending'
                        const unitizedRecord = new portfolioModel(newCustomerUnitizedRecord)
                        await unitizedRecord.save()
                    }      
                }))                      
                return { 
                    record: record.toJSON(currentAdmin),
                }
            }
        },
        verify: {
            actionType: 'record',
            component: false,
            isVisible: false,
            handler: async(request, response, context) => {
                const { record, resource, currentAdmin } = context
                let { byPass } = request.payload
                let tmpRecord = require('adminjs').flat.get(record.params)
                let period = require('adminjs').flat.get(record.populated.period.params)
                const currentStep = tmpRecord.currentStage
                let tmpStages = tmpRecord.stages
                let currentTaskNumber = tmpStages[currentStep-1].currentTaskNumber
                
                    let task = tmpStages[currentStep-1].tasks[currentTaskNumber]
                    let previousTaskCompleted = true
                    let currentTaskAlreadyCompleted = false
                    if (currentTaskNumber >= 1) {
                        if (tmpStages[currentStep-1].tasks[currentTaskNumber-1].status !== 'completed') {
                            previousTaskCompleted = false
                        }
                    }
                    if (task.status === 'completed' || byPass) {
                        currentTaskAlreadyCompleted = true
                    }
                    if (previousTaskCompleted && !currentTaskAlreadyCompleted) {
                        let taskSource = task.rule.source
                        let taskTarget = task.rule.target
                        let taskSourceQueriesIndex = tmpStages[currentStep-1].data.findIndex(item => item.name === taskSource) 
                        let taskTargetQueriesIndex = tmpStages[currentStep-1].data.findIndex(item => item.name === taskTarget)
                        let taskSourceItem = tmpStages[currentStep-1].data[taskSourceQueriesIndex]
                        let taskTargetItem = tmpStages[currentStep-1].data[taskTargetQueriesIndex]
                        let canSkipRetrieveSource = false
                        let canSkipRetrieveTarget = false
                        if (taskSourceItem.locked) {
                            canSkipRetrieveSource = true
                        }
                        if (taskTargetItem.locked) {
                            canSkipRetrieveSource = true
                        }
                        let taskSourceQueries = taskSourceItem.queries 
                        let taskTargetQueries = taskTargetItem.queries
                        let taskSourceModelName = taskSourceItem.modelName
                        let taskTargetModelName = taskTargetItem.modelName
                        let taskSouceModel = mongoose.connection.models[taskSourceModelName]
                        let taskTargetModel = mongoose.connection.models[taskTargetModelName]
                        let taskSourceQueriesDict = {}
                        let taskTargetQueriesDict = {}
                        let sourceTotal = 0
                        let targetTotal = 0
                        
                        if (!canSkipRetrieveSource) {
                            taskSourceQueries.forEach(query => {
                                let value = query.value
                                if (query.value.startsWith('placeholder')) {
                                    if (query.operator === 'range') {
                                        let start = eval(query.value.split(':')[1].split(',')[0])
                                        let end = eval(query.value.split(':')[1].split(',')[1])
                                        value = [start, end]
                                    } else {
                                        value = eval(query.value.split(':')[1])
                                    }
                                }
                                if (query.value.startsWith('or')) {
                                    let allowedValues = query.value.split(':')[1].split(',')
                                    let conditions = { $or: allowedValues.map(valueItem => ({[query.property] : valueItem}))}
                                    taskSourceQueriesDict = {...taskSourceQueriesDict, ...conditions}
                                }        
                                if (query.operator === 'equal') {
                                    taskSourceQueriesDict[query.property] = value
                                } else if (query.operator === 'lessthanorequal') {
                                    taskSourceQueriesDict[query.property] = { $lte: value }
                                } else if (query.operator === 'greaterthanorequal') {
                                    taskSourceQueriesDict[query.property] = { $gte: value }
                                } else if (query.operator === 'greaterthan') {
                                    taskSourceQueriesDict[query.property] = { $gt: value }
                                } else if (query.operator === 'range') {
                                    taskSourceQueriesDict[query.property] = { $gt: value[0], $lte: value[1] }
                                } if (query.value.startsWith('or')) {
                                    delete taskSourceQueriesDict[query.property]
                                }
                            })   
                            let resultSource = await taskSouceModel.find(taskSourceQueriesDict)
                            if (!tmpStages[currentStep-1].data[taskSourceQueriesIndex].locked) {
                                let subTotal = 0
                                if (taskSourceItem.subPath && taskSourceItem.subPath !== '' && resultSource.length === 1) {
                                    let tmpObj = getPropByString(resultSource[0], taskSourceItem.subPath)
                                    sourceTotal = tmpObj.length
                                } else if (taskSourceItem.subPath && taskSourceItem.subPath !== '' && resultSource.length > 1) {
                                    resultSource.forEach(source => {
                                        let tmpObj = getPropByString(source, taskSourceItem.subPath)
                                        subTotal = subTotal + tmpObj.length
                                    }) 
                                    sourceTotal = subTotal
                                } else {
                                    sourceTotal = resultSource.length
                                }
                            }                             
                            tmpStages[currentStep-1].data[taskSourceQueriesIndex].value = sourceTotal    
                        } else {
                            sourceTotal = taskSourceItem.value
                        }
                        
                        if (!canSkipRetrieveTarget) {
                            taskTargetQueries.forEach(query => {
                                let value = query.value
                                if (query.value.startsWith('placeholder')) {
                                    if (query.operator === 'range') {
                                        let start = eval(query.value.split(':')[1].split(',')[0])
                                        let end = eval(query.value.split(':')[1].split(',')[1])
                                        value = [start, end]
                                    } else {
                                        value = eval(query.value.split(':')[1])
                                    }
                                }
                                if (query.value.startsWith('or')) {
                                    let allowedValues = query.value.split(':')[1].split(',')
                                    let conditions = { $or: allowedValues.map(valueItem => ({[query.property] : valueItem}))}
                                    taskTargetQueriesDict = {...taskTargetQueriesDict, ...conditions}
                                }                        
                                if (query.operator === 'equal') {
                                    taskTargetQueriesDict[query.property] = value
                                } else if (query.operator === 'lessthanorequal') {
                                    taskTargetQueriesDict[query.property] = { $lte: value }
                                } else if (query.operator === 'greaterthanorequal') {
                                    taskTargetQueriesDict[query.property] = { $gte: value }
                                } else if (query.operator === 'greaterthan') {
                                    taskTargetQueriesDict[query.property] = { $gt: value }
                                } else if (query.operator === 'range') {
                                    taskTargetQueriesDict[query.property] = { $gt: value[0], $lte: value[1] }
                                }
                                if (query.value.startsWith('or')) {
                                    delete taskTargetQueriesDict[query.property]
                                } 
                            })  
                            let resultTarget = await taskTargetModel.find(taskTargetQueriesDict)
                            if (!tmpStages[currentStep-1].data[taskTargetQueriesIndex].locked) {
                                let subTotal = 0
                                if (taskTargetItem.subPath && taskTargetItem.subPath !== '' && resultTarget.length === 1) {
                                    console.log('1:',resultTarget[0])
                                    console.log('2:',taskTargetItem.subPath)
                                    let tmpObj = getPropByString(resultTarget[0], taskTargetItem.subPath)
                                    console.log('3:',tmpObj)
                                    targetTotal = tmpObj.length
                                } else if (taskTargetItem.subPath && taskTargetItem.subPath !== '' && resultTarget.length > 1) {
                                    resultTarget.forEach(target => {
                                        let tmpObj = getPropByString(target, taskTargetItem.subPath)
                                        subTotal = subTotal + tmpObj.length
                                    }) 
                                    targetTotal = subTotal
                                } else {
                                    targetTotal = resultTarget.length
                                }
                            }          
                            tmpStages[currentStep-1].data[taskTargetQueriesIndex].value = targetTotal
                        } else {
                            targetTotal = taskTargetItem.value
                        }
    
                        tmpStages[currentStep-1].tasks[currentTaskNumber].stat = `${targetTotal } / ${sourceTotal}`
                        if ((sourceTotal === targetTotal && targetTotal > 0 && sourceTotal > 0 && tmpStages[currentStep-1].tasks[currentTaskNumber].status === 'pending')) {
                            tmpStages[currentStep-1].tasks[currentTaskNumber].status = 'completed'
                            tmpStages[currentStep-1].currentTaskNumber = tmpStages[currentStep-1].currentTaskNumber + 1
                            tmpStages[currentStep-1].data[taskSourceQueriesIndex].locked = true
                            tmpStages[currentStep-1].data[taskTargetQueriesIndex].locked = true
                        }
                    }
                    if (byPass) {
                        tmpStages[currentStep-1].tasks[currentTaskNumber].status = 'completed'
                        tmpStages[currentStep-1].currentTaskNumber = tmpStages[currentStep-1].currentTaskNumber + 1
                    }
                

                if (tmpStages[currentStep-1].tasks.filter(task => { return (task.status === 'completed') }).length === tmpStages[currentStep-1].tasks.length) {
                    tmpStages[currentStep-1].completed = true
                }
                await record.update({stages: tmpStages})
                return { 
                    record: record.toJSON(currentAdmin),
                }
            }
        },
        list: {
            before: async(request, context) => {
                const { currentAdmin } = context
                return {
                    ...request,
                    query: {
                        ...request.query,
                    }
                }
            }
        },
        show: {
            isAccessible: true,
            component: AdminJS.bundle('../components/WorkflowConfig.jsx')
        },
        edit: {
            isAccessible: true,
            isVisible: false
        },
        bulkDelete: {
            isAccessible: false
        }
    }
}

module.exports = WorkflowConfigResource