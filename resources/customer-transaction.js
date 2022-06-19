const AdminJS = require('adminjs')
const User = require('../models/user.model')
const Message = require('../models/message-model')
const sendNotificationEmail = require('../utils/email')
const mongoose = require('mongoose')
const { io } = require('../app')

const CustomerTransactionResource = {
    id: 'CustomerTransaction',
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        recordEnteredBy: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        status: {
            isVisible: { list: false, filter: true, show: true, edit: false },
            position: 8,
        },
        customer: {
            isVisible: true,
            position: 2,
        },
        nominalValue: {
            isVisible: { list: true, filter: false, show: true, edit: true },
            position: 4,
        },
        transactionType: {
            isVisible: { list: true, filter: true, show: true, edit: true },
        },
        currency: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            position: 3,
        },
        date: {
            type: 'date',
            components: {
                edit: AdminJS.bundle('../components/DateControl.jsx')
            },
            position: 1,
            isVisible: { list: true, filter: true, show: true, edit: true },
        },
        isSeedMoney: {
            isVisible: { list: false, filter: true, show: true, edit: true },
            position: 5
        },
        subscribeUnitNumber: {
            isVisible: { list: false, filter: false, show: true, edit: true },
            position: 7
        },
        remark: {
            isVisible: { list: false, filter: false, show: true, edit: true },
            position: 7,
            type: 'textarea'
        },
        period: {
            isVisible: { list: false, filter: true, show: true, edit: false },
        }
    },
    actions: {
        new: {
            before: async(request, context) => {
                const { currentAdmin } = context
                let custPortfolioModel = mongoose.connection.models['CustomerPortfolio']
                let custAcct = await custPortfolioModel.findOne({customer: request.payload.customer})
                request.payload = {
                    ...request.payload,
                    recordEnteredBy: currentAdmin.id,
                    period: currentAdmin.period,
                    status: 'pending',
                    currency: custAcct.currency
                }
                return request
            },
            isAccessible: ({ currentAdmin }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin' || currentAdmin.role === 'user'
                )
            },
            showInDrawer: true,
            layout: [
                ['date', { ml: 'xxl' }], 
                ['customer', { ml: 'xxl' }],
                ['transactionType', { ml: 'xxl' }],
                ['nominalValue', { ml: 'xxl' }],
                ['isSeedMoney', { ml: 'xxl '}],
                ['subscribeUnitNumber', { ml: 'xxl'}],
                ['remark', { ml: 'xxl' }]
            ]
        },
        list: {
            isAccessible: ({ currentAdmin }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin' || currentAdmin.role === 'user'
                )
            },
        },
        edit: {
            before: async (request, context) => {
                request.payload = {
                    ...request.payload,
                    status: 'pending',
                }
                return request
            },
            isAccessible: ({ currentAdmin, record }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin'
                  || (currentAdmin.id === record.param('recordEnteredBy') && !record.param('isReconciled'))
                )
            },
            showInDrawer: true,
            layout: [
                ['date', { ml: 'xxl' }], 
                ['customer', { ml: 'xxl' }],
                ['transactionType', { ml: 'xxl' }],
                ['nominalValue', { ml: 'xxl' }],
                ['isSeedMoney', { ml: 'xxl '}],
                ['subscribeUnitNumber', { ml: 'xxl'}],
                ['remark', { ml: 'xxl' }]
            ]
        },
        delete: {
            isAccessible: true
        },
        bulkDelete: {
            isAccessible: false
        },
        show: {
            showInDrawer: true
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
        notify: {
            actionType: 'resource',
            component: false,
            handler: async (request, response, context) => {
                const { record, resource, currentAdmin } = context
                if (currentAdmin.role === 'user') {
                    let results = await resource.MongooseModel.find()
                    let pending = results.filter(record => {return record.status === 'pending'})
                    let totalCount = pending.length
                    let msg = `There are ${totalCount} customer transaction records to be approved`
                    let adminusers = await User.find({role: 'admin'})
                    let adminusersEmail = adminusers.filter(record => { return (record.role === 'admin')}).map(record => record.email).join(',')
                    await sendNotificationEmail(msg, adminusersEmail)
                    await Promise.all(adminusers.map(async (user) => {
                        if (user.role === 'admin') {
                            const message = new Message({
                                text: msg,
                                link: '/admin/resources/CustomerTransaction?filters.status=pending&page=1',
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
                    let msg = `There are ${count} customer transaction records rejected by admin. Please review and amend.`
                    let usersEmail = rejected.join(',')
                    await sendNotificationEmail(msg, usersEmail)
                    let users = await User.find({role: 'user'})
                    await Promise.all(users.map(async (user) => {
                        if (user.role === 'user') {
                            const message = new Message({
                                text: msg,
                                link: '/admin/resources/CustomerTransaction?filters.status=rejected&page=1',
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

module.exports = CustomerTransactionResource