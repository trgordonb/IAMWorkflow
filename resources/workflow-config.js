const AdminJS = require('adminjs')
const stages = require('../config/stages.template')
const Period = require('../models/period-model')
const mongoose = require('mongoose')

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
        verify: {
            actionType: 'record',
            component: false,
            handler: async(request, response, context) => {
                const { record, resource, currentAdmin } = context
                let tmpRecord = require('adminjs').flat.get(record.params)
                const currentStep = tmpRecord.currentStage
                let tmpStages = tmpRecord.stages
                await Promise.all(tmpStages[currentStep-1].tasks.map(async (task, index) => {
                    let taskSource = task.rule.source
                    let taskTarget = task.rule.target
                    let taskSourceQueriesIndex = tmpStages[currentStep-1].data.findIndex(item => item.name === taskSource) 
                    let taskTargetQueriesIndex = tmpStages[currentStep-1].data.findIndex(item => item.name === taskTarget)
                    let taskSourceItem = tmpStages[currentStep-1].data[taskSourceQueriesIndex]
                    let taskTargetItem = tmpStages[currentStep-1].data[taskTargetQueriesIndex]
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
                    let sourceArray = Array.from(Array(taskSourceItem.factor).keys())
                    let targetArray = Array.from(Array(taskTargetItem.factor).keys())

                    await Promise.all(sourceArray.map(async (idx) => {
                        taskSourceQueries.forEach(query => {
                            if (query.property === 'period') {
                                query.value = record.params.period
                            }
                            if (query.property === 'accountStartDate') {
                                query.value = tmpRecord.subPeriodEndDates[idx]
                            }
                            if (query.operator === 'equal') {
                                taskSourceQueriesDict[query.property] = query.value
                            } else if (query.operator === 'lessthanorequal') {
                                taskSourceQueriesDict[query.property] = { $lte: query.value }
                            }
                        })   
                        const resultSource = await taskSouceModel.find(taskSourceQueriesDict)
                        if (!tmpStages[currentStep-1].data[taskSourceQueriesIndex].locked) {
                            sourceTotal = sourceTotal + resultSource.length
                        }
                    }))
                    tmpStages[currentStep-1].data[taskSourceQueriesIndex].value = sourceTotal

                    await Promise.all(targetArray.map(async (idx) => {
                        taskTargetQueries.forEach(query => {
                            if (query.property === 'period') {
                                query.value = record.params.period
                            }
                            if (query.property === 'accountStartDate') {
                                query.value = tmpRecord.subPeriodEndDates[idx]
                            }
                            if (query.operator === 'equal') {
                                taskTargetQueriesDict[query.property] = query.value
                            } else if (query.operator === 'lessthanorequal') {
                                taskTargetQueriesDict[query.property] = { $lte: query.value }
                            }
                        })   
                        const resultTarget = await taskTargetModel.find(taskTargetQueriesDict)             
                        if (!tmpStages[currentStep-1].data[taskTargetQueriesIndex].locked) {
                            targetTotal = targetTotal + resultTarget.length
                        }
                    }))
                    tmpStages[currentStep-1].data[taskTargetQueriesIndex].value = targetTotal
                    
                    tmpStages[currentStep-1].tasks[index].stat = `${targetTotal } / ${sourceTotal}`
                    if (sourceTotal === targetTotal && targetTotal > 0 && sourceTotal > 0 && tmpStages[currentStep-1].tasks[index].status === 'pending') {
                        tmpStages[currentStep-1].tasks[index].status = 'completed'
                        tmpStages[currentStep-1].data[taskSourceQueriesIndex].locked = true
                        tmpStages[currentStep-1].data[taskTargetQueriesIndex].locked = true
                    }
                }))
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