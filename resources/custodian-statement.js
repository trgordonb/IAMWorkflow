const AdminJS = require('adminjs')
const User = require('../models/user.model')
const Message = require('../models/message-model')
const sendNotificationEmail = require('../utils/email')
const { io } = require('../app')

const CustodianStatementResource = {
    id: 'Custodian Statement',
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        recordEnteredBy: {
            isVisible: { list: false, filter: false, show: true, edit: false },
        },
        custodianAccount: {
            isTitle: true
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
                const { record, resource, currentAdmin } = context
                await record.update({ status: 'approved', alert: false })
                return { 
                    record: record.toJSON(currentAdmin),
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
                const { record, resource, currentAdmin } = context
                await record.update({ status: 'rejected', alert: false })
                return { 
                    record: record.toJSON(currentAdmin),
                    notice: { message: 'Reject done', type: 'success' }
                }
            }
        },
        count: {
            actionType: 'resource',
            isVisible: false,
            isAccessible: true,
            component: false,
            handler: async(request, response, context) => {
                const { record, resource, currentAdmin } = context
                const records = await resource.MongooseModel.countDocuments({status: 'rejected'})
                return { data: records ? records : 0 }
            }
        },
        notify: {
            actionType: 'resource',
            component: false,
            handler: async (request, response, context) => {
                const { record, resource, currentAdmin } = context
                if (currentAdmin.role === 'user') {
                    let results = await resource.MongooseModel.find().populate('custodianAccount')
                    //let allRecords = results.filter(record => { return (true)})
                    let alertRecords = []
                    const groupByAcct = results.reduce((group, record) => {
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
                                if (((Math.abs((curTotal - prevTotal) / prevTotal)) > 0.1) && (record.status === 'pending')) {
                                    alertRecords.push(record.id)
                                }
                            }
                        })
                    })
                    let pending = results.filter(record => {return record.status === 'pending'})
                    let totalCount = pending.length

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
                    await Promise.all(adminusers.map(async (user) => {
                        if (user.role === 'admin') {
                            const message = new Message({
                                text: msg,
                                link: '/admin/resources/Custodian Statement?filters.status=pending&page=1',
                                target: user.id
                            })
                            await message.save()
                        }
                    }))
                    io.to('admin').emit('System', {
                        type: 'Message',
                        data: {
                            text: 'New message'
                        }
                    })
                } else if (currentAdmin.role === 'admin') {
                    let results = await resource.MongooseModel.find().populate('recordEnteredBy')
                    let rejected = results.filter(record => { return (record.status === 'rejected')}).map(record => record.recordEnteredBy.email)
                    let count = rejected.length
                    let msg = `There are ${count} custodian statement records rejected by admin. Please review and amend.`
                    let usersEmail = rejected.join(',')
                    await sendNotificationEmail(msg, usersEmail)
                    let users = await User.find({role: 'user'})
                    await Promise.all(users.map(async (user) => {
                        if (user.role === 'user') {
                            const message = new Message({
                                text: msg,
                                link: '/admin/resources/Custodian Statement?filters.status=rejected&page=1',
                                target: user.id
                            })
                            await message.save()
                        }
                    }))
                    io.to('user').emit('System', {
                        type: 'Message',
                        data: {
                            text: 'New message'
                        }
                    })
                }
                return { notice: { message: 'Notification sent', type: 'success' } }
            }
        }
    }
}

module.exports = CustodianStatementResource 