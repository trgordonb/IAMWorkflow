const AdminJS = require('adminjs')
const stages = require('../config/stages.template')
const Period = require('../models/period-model')
const mongoose = require('mongoose')
const { jsPDF } = require('jspdf/dist/jspdf.node')
const moment = require('moment')

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
        gendnote: {
            actionType: 'record',
            component: false,
            isVisible: false,
            handler: async(request, response, context) => {
                const { record, resource, currentAdmin } = context
                let currentStage = record.params.currentStage
                let tmpRecord = require('adminjs').flat.get(record.params)
                let period = require('adminjs').flat.get(record.populated.period.params)
                let demandNoteModel = mongoose.connection.models['DemandNoteItem']
                let accountPolicyModel = mongoose.connection.models['AccountPolicy']
                let custodianStatementModel = mongoose.connection.models['CustodianStatement']
                let feeCodeModel = mongoose.connection.models['FeeCode']
                let endDate = tmpRecord.subPeriodEndDates[currentStage-1]
                let customerPortfolioRecords = await custodianStatementModel.find({
                    period: period,
                    statementDate: endDate,
                    status: 'approved'
                })
                await Promise.all(customerPortfolioRecords.map(async (pRecord) => {
                    let demandNoteItem = {}
                    let accountPolicy = await accountPolicyModel.findById(pRecord.custodianAccount)
                    let feeCode = accountPolicy.feeCode
                    let feeRate = await feeCodeModel.findById(feeCode)
                    demandNoteItem.period = period._id
                    demandNoteItem.custodianAccount = pRecord.custodianAccount
                    demandNoteItem.accountNAV = pRecord.total
                    demandNoteItem.custodian = accountPolicy.custodian
                    let isFull = true
                    if (moment(accountPolicy.accountStartDate).diff(moment(period.start)) > 0) {
                        isFull = false
                    }
                    if (isFull) {
                        demandNoteItem.factor = period.factor * ( feeRate.value / 100 )
                    } else {
                        let start = moment(accountPolicy.accountStartDate)
                        let end = moment(endDate)
                        let days = moment.duration(end.diff(start)).asDays()
                        let isLeapYear = moment().isLeapYear()
                        let newFactor = isLeapYear ? days / 366 : days / 365
                        demandNoteItem.factor = newFactor * ( feeRate.value / 100 )
                    }
                    const newDemandNoteItem = new demandNoteModel(demandNoteItem)
                    await newDemandNoteItem.save()
                }))
                return { 
                    record: record.toJSON(currentAdmin),
                }
            }
        },
        printdn: {
            actionType: 'record',
            component: false,
            isVisible: false,
            handler: async(request, response, context) => {
                const { record, resource, currentAdmin } = context
                let tmpRecord = require('adminjs').flat.get(record.params)
                let period = require('adminjs').flat.get(record.populated.period.params)
                let demandNoteModel = mongoose.connection.models['DemandNoteItem']
                let custodianModel = mongoose.connection.models['Custodian']
                let periodName = period.name
                let periodStart = period.start
                let periodEnd = period.end
                let demandNoteItems = await demandNoteModel.
                                            find({period: period._id}).
                                            populate({path: 'custodianAccount'}).
                                            populate({path: 'custodian', populate: {path: 'currency'}})
                let transformedRecords = demandNoteItems.map(item => {return {
                    account: item.custodianAccount.accountNumber,
                    custodian: item.custodian.name,
                    currency: item.custodian.currency.name,
                    amount: (item.accountNAV * item.factor).toFixed(2)
                }})
                let custodianGp = {}
                transformedRecords.forEach(record => {
                    let key = `${record.custodian}:${record.currency}`
                    if (!custodianGp.hasOwnProperty(key)) {
                        custodianGp[key] = []
                    }
                    custodianGp[key].push({account: record.account, amount: record.amount})
                })
                let pdfData = null
                let pdfDoc = null
                const { applyPlugin } = require('../lib/jspdf.plugin.autotable')
                applyPlugin(jsPDF)
                pdfDoc = new jsPDF()
                Object.keys(custodianGp).forEach((key,idx) => {
                    let total = 0
                    custodianGp[key].forEach(item => {
                        total = total + parseFloat(item.amount)
                    })
                    pdfDoc.setFontSize(12)
                    pdfDoc.text(`${moment(periodEnd).format('YYYY-MM-DD')}`, 14, 10)
                    pdfDoc.text(`${key.split(':')[0]} (${key.split(':')[1]})`, 14, 20)
                    pdfDoc.autoTable({
                        styles: {
                            fontSize: 10
                        },
                        startY: 30,
                        head: [['Account','Amount']],
                        columnStyles: {
                            3: { halign: 'left' }
                        },
                        body: custodianGp[key].map(item => ([item.account, item.amount]))
                    })
                    pdfDoc.setFontSize(12)
                    pdfDoc.text(`Total:        ${total.toFixed(2)}`, 102, pdfDoc.lastAutoTable.finalY + 10)
                    if (idx < Object.keys(custodianGp).length - 1) {
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
                let customerPortfolioRecords = await customerModel.find({startDate: {$lte: endDate}})
                    
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
                            if (assetAllocationRecord && pRecord.currency.toString() === assetAllocationRecord.currency.toString()) {
                                total = total + assetAllocationRecord.total
                            } 
                            else if (assetAllocationRecord && pRecord.currency.toString() !== assetAllocationRecord.currency.toString()) {
                                total = total + assetAllocationRecord.total * 7.8
                            }
                        }))
                        
                        let totalDeposit = 0
                        let totalWithdraw = 0
                        let CustomerTransactionRecords = await customerTransModel.find({date: {$lte: endDate, $gt: newCustomerUnitizedRecord.lastSubPeriodDate}, status: 'approved', customer: pRecord.customer})
                        await Promise.all(CustomerTransactionRecords.map(async (tran) => {
                            if (pRecord.currency.toString() === tran.currency.toString()) {
                                if (tran.transactionType === 'deposit') {
                                    totalDeposit = totalDeposit + tran.nominalValue
                                } else if (tran.transactionType === 'withdraw') {
                                    totalWithdraw = totalWithdraw + tran.nominalValue
                                }
                            } else {
                                if (tran.transactionType === 'deposit') {
                                    totalDeposit = totalDeposit + tran.nominalValue * 7.8
                                } else if (tran.transactionType === 'withdraw') {
                                    totalWithdraw = totalWithdraw + tran.nominalValue * 7.8
                                }
                            }
                        }))
                        newCustomerUnitizedRecord.currentSubPeriodDeposited = Math.round(100*totalDeposit,2)/100
                        newCustomerUnitizedRecord.currentSubPeriodWithdrawn = Math.round(100*totalWithdraw,2)/100
                        if (prevUnitizedRecord.length === 0) {
                            newCustomerUnitizedRecord.currentSubPeriodUnitsDeposited = Math.round(10000*newCustomerUnitizedRecord.currentSubPeriodDeposited / (pRecord.startNAV/pRecord.startUnit),4)/10000
                            newCustomerUnitizedRecord.currentSubPeriodUnitsWithdrawn = Math.round(10000*newCustomerUnitizedRecord.currentSubPeriodWithdrawn / (pRecord.startNAV/pRecord.startUnit),4)/10000
                        } else {
                            newCustomerUnitizedRecord.currentSubPeriodUnitsDeposited = Math.round(10000*newCustomerUnitizedRecord.currentSubPeriodDeposited / prevUnitizedRecord[0].currentSubPeriodNAVPerUnit,4)/10000
                            newCustomerUnitizedRecord.currentSubPeriodUnitsWithdrawn = Math.round(10000*newCustomerUnitizedRecord.currentSubPeriodWithdrawn / prevUnitizedRecord[0].currentSubPeriodNAVPerUnit,4)/10000    
                        }
                        newCustomerUnitizedRecord.currentSubPeriodNAV = Math.round(total*100,2)/100
                        newCustomerUnitizedRecord.currentSubPeriodUnit = newCustomerUnitizedRecord.lastSubPeriodUnit - newCustomerUnitizedRecord.currentSubPeriodUnitsWithdrawn + newCustomerUnitizedRecord.currentSubPeriodUnitsDeposited
                        newCustomerUnitizedRecord.currentSubPeriodNAVPerUnit = Math.round(100* total / newCustomerUnitizedRecord.currentSubPeriodUnit,2)/100
                        newCustomerUnitizedRecord.netChange = Math.round(100*((newCustomerUnitizedRecord.currentSubPeriodNAV - newCustomerUnitizedRecord.lastSubPeriodNAV) - newCustomerUnitizedRecord.currentSubPeriodDeposited + newCustomerUnitizedRecord.currentSubPeriodWithdrawn),2)/100
                        if (prevUnitizedRecord.length === 0) {
                            newCustomerUnitizedRecord.unitizedChange = Math.round(1000*(100*(newCustomerUnitizedRecord.currentSubPeriodNAVPerUnit - (pRecord.startNAV/pRecord.startUnit)) / (pRecord.startNAV/pRecord.startUnit)),3)/1000
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
                
                await Promise.all(tmpStages[currentStep-1].tasks.map(async (task, index) => {
                    let previousTaskCompleted = true
                    let currentTaskAlreadyCompleted = false
                    if (index >= 1) {
                        if (tmpStages[currentStep-1].tasks[index-1].status !== 'completed') {
                            previousTaskCompleted = false
                        }
                    }
                    if (task.status === 'completed') {
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
                                }
                            })   
                            let resultSource = await taskSouceModel.find(taskSourceQueriesDict)
                            if (!tmpStages[currentStep-1].data[taskSourceQueriesIndex].locked) {
                                sourceTotal = resultSource.length
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
                            })  
                            let resultTarget = await taskTargetModel.find(taskTargetQueriesDict)
                            if (!tmpStages[currentStep-1].data[taskTargetQueriesIndex].locked) {
                                targetTotal = resultTarget.length
                            }          
                            tmpStages[currentStep-1].data[taskTargetQueriesIndex].value = targetTotal
                        } else {
                            targetTotal = taskTargetItem.value
                        }
    
                        tmpStages[currentStep-1].tasks[index].stat = `${targetTotal } / ${sourceTotal}`
                        if ((sourceTotal === targetTotal && targetTotal > 0 && sourceTotal > 0 && tmpStages[currentStep-1].tasks[index].status === 'pending') || byPass) {
                            tmpStages[currentStep-1].tasks[index].status = 'completed'
                            tmpStages[currentStep-1].data[taskSourceQueriesIndex].locked = true
                            tmpStages[currentStep-1].data[taskTargetQueriesIndex].locked = true
                            byPass = false
                        }
                    }
                }))

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
        delete: {
            isAccessible: false
        },
        bulkDelete: {
            isAccessible: false
        }
    }
}

module.exports = WorkflowConfigResource