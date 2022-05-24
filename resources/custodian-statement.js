const AdminJS = require('adminjs')
const User = require('../models/user.model')
const CustodianStatement = require('../models/custodian-statement-model')
const sendNotificationEmail = require('../utils/email')

const CustodianStatementResource = {
    id: 'Custodian Statement',
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        recordEnteredBy: {
            isVisible: { list: false, filter: false, show: true, edit: false },
        },
        statementDate: {
            type: 'date',
            isVisible: { list: true, filter: true, show: true, edit: true },
        },
        currency: {
            isVisible: { list: false, filter: true, show: true, edit: true },
        },
        cashValue: {
            isVisible: { list: true, filter: false, show: true, edit: true },
        },
        equitiesValue: {
            isVisible: { list: true, filter: false, show: true, edit: true },
        },
        derivativesValue: {
            isVisible: { list: true, filter: false, show: true, edit: true },
        },
        bondsValue: {
            isVisible: { list: true, filter: false, show: true, edit: true },
        },
        alternativesValue: {
            isVisible: { list: true, filter: false, show: true, edit: true },
        },
        total: {
            isVisible:{ list: true, filter: false, show: true, edit: true }
        },
        cashAllocation: {
            isVisible:{ list: false, filter: false, show: true, edit: true }
        },
        equitiesAllocation: {
            isVisible:{ list: false, filter: false, show: true, edit: true }
        },
        derivativesAllocation: {
            isVisible:{ list: false, filter: false, show: true, edit: true }
        },
        bondsAllocation: {
            isVisible:{ list: false, filter: false, show: true, edit: true }
        },
        alternativesAllocation: {
            isVisible:{ list: false, filter: false, show: true, edit: true }
        },
        status: {
            isVisible:{ list: true, filter: true, show: true, edit: false }
        },
        alert: {
            isVisible: { list: false, filter: true, show: true, edit: false }
        }
    },
    actions: {
        new: {
            before: async (request, context) => {
                const { currentAdmin } = context
                request.payload = {
                    ...request.payload,
                    recordEnteredBy: currentAdmin.id,
                    status: 'pending'
                }
                return request
            },
            isAccessible: ({ currentAdmin }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin' || currentAdmin.role === 'user'
                )
            },
            showInDrawer: false,        
            component: AdminJS.bundle('../components/CustodianStatement.jsx'),
        },
        edit: {
            isAccessible: ({ currentAdmin }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin' || currentAdmin.role === 'user'
                )
            },
            before: async (request, context) => {
                request.payload = {
                    ...request.payload,
                    status: 'pending'
                }
                return request
            },
            showInDrawer: false,
            component: AdminJS.bundle('../components/CustodianStatement.jsx'),
        },
        delete: {
            isAccessible: ({ currentAdmin, record }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin'
                  || (currentAdmin.id === record.param('recordEnteredBy'))
                )
            }
        },
        show: {
            isAccessible: ({ currentAdmin }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin' || currentAdmin.role === 'user'
                )
            },
            showInDrawer: false,
            component: AdminJS.bundle('../components/CustodianStatementShow.jsx'),
        },
        stat: {
            isAccessible: ({ currentAdmin }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin' || currentAdmin.role === 'user'
                )
            },
            showInDrawer: false,
            component: AdminJS.bundle('../components/DataStat.jsx')
        },
        bulkDelete: {
            isAccessible: false
        },
        approve: {
            actionType: 'record',
            isAccessible: ({ currentAdmin, record }) => {
                return (currentAdmin && currentAdmin.role === 'admin') 
            },
            component: false,
            handler: async(request, response, context) => {
                let record = await CustodianStatement.findById(request.params.recordId)
                record.status = 'approved'
                record.alert = false
                await record.save()
                return { 
                    record: context.record.toJSON(context.currentAdmin),
                    notice: { message: 'Approval done', type: 'success' }
                }
            }
        },
        reject: {
            actionType: 'record',
            isAccessible: ({ currentAdmin, record }) => {
                return (currentAdmin && currentAdmin.role === 'admin') 
            },
            component: false,
            handler: async(request, response, context) => {
                let record = await CustodianStatement.findById(request.params.recordId)
                record.status = 'rejected'
                record.alert = false
                await record.save()
                return { 
                    record: context.record.toJSON(context.currentAdmin),
                    notice: { message: 'Reject done', type: 'success' }
                }
            }
        },
        notify: {
            actionType: 'resource',
            component: false,
            handler: async (request, response, context) => {
                const { record, resource, currentAdmin } = context
                if (currentAdmin.role === 'user') {
                    let results = await resource.MongooseModel.find().populate('custodianAccount')
                    let pending = results.filter(record => { return (record.status === 'pending')})
                    let totalCount = pending.length
                    let alertRecords = []
                    const groupByAcct = pending.reduce((group, record) => {
                        const { custodianAccount } = record;
                        group[custodianAccount.accountNumber] = group[custodianAccount.accountNumber] ?? [];
                        group[custodianAccount.accountNumber].push(record);
                        return group;
                    }, {});
                    let accounts = Object.keys(groupByAcct)
                    accounts.forEach(account => {
                        let records = groupByAcct[account].sort((a,b) => (a.statementDate > b.statementDate) ? 1: -1)
                        records.forEach((record, idx) => {
                            if (idx >= 1) {
                                let prevTotal = records[idx-1].total
                                let curTotal = record.total
                                if ((Math.abs((curTotal - prevTotal) / prevTotal)) > 0.1) {
                                    alertRecords.push(record.id)
                                }
                            }
                        })
                    })
                    await Promise.all(alertRecords.map(async (record) => {
                        await resource.MongooseModel.findByIdAndUpdate(record, {
                            alert: true
                        })
                    }))
                    let msg = `There are ${totalCount} custodian statement records to be approved`
                    if (alertRecords.length > 0) {
                        msg = msg + ` and ${alertRecords.length} are marked as alert and require your attention`
                    }
                    let adminusers = await User.find({role: 'admin'})
                    let adminusersEmail = adminusers.filter(record => { return (record.role === 'admin')}).map(record => record.email).join(',')
                    await sendNotificationEmail(msg, adminusersEmail)
                } else if (currentAdmin.role === 'admin') {
                    let results = await resource.MongooseModel.find().populate('recordEnteredBy')
                    let rejected = results.filter(record => { return (record.status === 'rejected')}).map(record => record.recordEnteredBy.email)
                    let count = rejected.length
                    let msg = `There are ${count} custodian statement records rejected by admin. Please review and amend.`
                    let usersEmail = rejected.join(',')
                    await sendNotificationEmail(msg, usersEmail)
                }
                return { notice: { message: 'Notification sent', type: 'success' } }
            }
        }
    }
}

module.exports = CustodianStatementResource 