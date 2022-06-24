const AdminJS = require('adminjs')
const mongoose = require('mongoose')
const sendNotificationEmail = require('../utils/email')
const { io } = require('../app')

const CustomerUnitizedPerformanceResource = {
    id: 'CustomerUnitizedPerformance',
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        period: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        customer: {
            isVisible: true,
            position: 1
        },
        lastSubPeriodDate: {
            type: 'date',
            isVisible: { list: false, filter: true, show: true, edit: false },
            position: 2
        },
        lastSubPeriodUnit: {
            isVisible: { list: false, filter: false, show: true, edit: false },
            position: 3
        },
        lastSubPeriodNAV: {
            isVisible: { list: false, filter: false, show: true, edit: false },
            position: 4
        },
        currentSubPeriodDate: {
            type: 'date',
            isVisible: { list: true, filter: true, show: true, edit: false },
            position: 5
        },
        currentSubPeriodUnit: {
            isVisible: { list: true, filter: false, show: true, edit: false },
            position: 6
        },
        currentSubPeriodNAV: {
            isVisible: { list: true, filter: false, show: true, edit: false },
            position: 7
        },
        currentSubPeriodNAVPerUnit: {
            isVisible: { list: true, filter: false, show: true, edit: false },
            position: 8
        },
        currentSubPeriodDeposited: {
            isVisible: { list: false, filter: false, show: true, edit: false },
            position: 9
        },
        currentSubPeriodWithdrawn: {
            isVisible: { list: false, filter: false, show: true, edit: false },
            position: 10
        },
        currentSubPeriodUnitsDeposited: {
            isVisible: { list: false, filter: false, show: true, edit: false },
            position: 11
        },
        currentSubPeriodUnitsWithdrawn: {
            isVisible: { list: false, filter: false, show: true, edit: false },
            position: 12
        },
        netChange: {
            isVisible: { list: false, filter: false, show: true, edit: false },
            position: 13
        },
        unitizedChange: {
            isVisible: { list: true, filter: false, show: true, edit: false },
            position: 14
        },
        alert: {
            isVisible: { list: false, filter: true, show: true, edit: false },
            position: 15
        }
    },
    actions: {
        new: {
            isAccessible: false
        },
        delete: {
            isAccessible: false
        },
        edit: {
            isAccessible: false
        },
        bulkDelete: {
            isAccessible: false
        }, 
        list: {
            isAccessible: true,
            component: AdminJS.bundle('../components/CustomerUnitizedPerformanceList.jsx')
        },
        show: {
            showInDrawer: false,
            component: AdminJS.bundle('../components/UnitizedPerformance.jsx'),
        },
        approve: {
            actionType: 'record',
            isAccessible: ({ currentAdmin, record }) => {
                return (currentAdmin && currentAdmin.role === 'admin') 
            },
            component: false,
            handler: async(request, response, context) => {
                const { record, resource, currentAdmin } = context
                await record.update({ status: 'approved' })
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
                await record.update({ status: 'rejected' })
                return { 
                    record: record.toJSON(currentAdmin),
                    notice: { message: 'Reject done', type: 'success' }
                }
            }
        },
        notify: {
            actionType: 'resource',
            component: false,
            handler: async (request, response, context) => {
                const { record, resource, currentAdmin } = context
                let userModel = mongoose.connection.models['User']
                let messageModel = mongoose.connection.models['Message']
                if (currentAdmin.role === 'user') {
                    let results = await resource.MongooseModel.find({
                        status: 'pending',
                        period: currentAdmin.period
                    })
                    let alertRecords = results.filter(record => {return Math.abs(record.unitizedChange) > 10})
                    let totalCount = results.length

                    await Promise.all(alertRecords.map(async (record) => {
                        await resource.MongooseModel.findByIdAndUpdate(record.id, {
                            alert: true
                        })
                    }))
                    let msg = `There are ${totalCount} unitized performance records to be approved`
                    if (alertRecords.length > 0) {
                        msg = msg + ` and ${alertRecords.length} are marked as alert and require your attention`
                    }
                    let adminusers = await userModel.find({role: 'admin'})
                    let adminusersEmail = adminusers.filter(record => { return (record.role === 'admin')}).map(record => record.email).join(',')
                    await sendNotificationEmail(msg, adminusersEmail)
                    await Promise.all(adminusers.map(async (user) => {
                        if (user.role === 'admin') {
                            const message = new messageModel({
                                text: msg,
                                link: '/admin/resources/CustomerUnitizedPerformance?filters.status=pending&page=1',
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
                    let results = await resource.MongooseModel.find({
                        status: 'rejected',
                        period: currentAdmin.period
                    })
                    let count = results.length
                    let msg = `There are ${count} unitized performance records rejected by admin. Please review and amend.`
                    let usersEmail = rejected.join(',')
                    await sendNotificationEmail(msg, usersEmail)
                    let users = await userModel.find({role: 'user'})
                    await Promise.all(users.map(async (user) => {
                        if (user.role === 'user') {
                            const message = new messageModel({
                                text: msg,
                                link: '/admin/resources/CustomerUnitizedPerformance?filters.status=rejected&page=1',
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

module.exports = CustomerUnitizedPerformanceResource