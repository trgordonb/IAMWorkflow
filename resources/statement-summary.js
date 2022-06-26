const AdminJS = require('adminjs')
const mongoose = require('mongoose')

const StatementSummaryResource = {
    id: 'StatementSummary',
    properties: {
        _id: {
            isVisible: false
        },
        name: {
            isTitle: true,
            isVisible: { list: true, filter: true, show: true, edit: true },
            position: 1
        },
        sum: {
            isVisible: { list: true, filter: false, show: true, edit: false },
            position: 10
        },
        custodian: {
            isVisible: { list: true, filter: false, show: true, edit: true },
            position: 5
        },
        currency: {
            isVisible: { list: true, filter: false, show: true, edit: true },
            position: 4
        },
        type: {
            isVisible: { list: true, filter: false, show: true, edit: true },
            position: 3
        },
        period: {
            isVisible: { list: true, filter: false, show: true, edit: false },
            position: 2
        },
        status: {
            isVisible: { list: true, filter: true, show: true, edit: false },
            position: 6
        },
        details: {
            isVisible: { list: false, filter: false, show: true, edit: true },
            position: 7,
        },
        matched: {
            isVisible: { list: false, filter: true, show: true, edit: false },
        },
        'details.tag': {
            isVisible: false
        },
        'details.currency': {
            isVisible: false
        },
        'details.type': {
            isVisible: false
        },
        'details.feeCodeApplied': {
            isVisible: false
        },
        'details.reconcilation': {
            isVisible: false
        },
        'details.reconcilation.completed': {
            isVisible: false
        },
        'details.reconcilation.netAmount': {
            isVisible: false
        },
        'details.reconcilation.bankCharge': {
            isVisible: false
        },
        'details.reconcilation.payableInHKD': {
            isVisible: false
        },
        'details.period': {
            isVisible: false
        }
    },
    actions: {
        new: {
            isAccessible: true,
            before: async(request, context) => {
                const { currentAdmin } = context
                let details =  require('adminjs').flat.get(request.payload).details
                let total = 0
                details.forEach((record) => {
                    record.currency = request.payload.currency
                    record.tag = request.payload.name
                    record.type = request.payload.type
                    record.period = currentAdmin.period
                    record.reconcilation = {
                        completed: false,
                        netAmount: 0,
                        bankCharge: 0,
                        payableInHKD: 0
                    }
                    total = total + parseFloat(record.amount)
                })
                let payload = {...request.payload,
                    period: currentAdmin.period,
                    status: 'pending',
                    sum: Math.round(100 * total, 2)/100,
                    details: details
                }
                request.payload = require('adminjs').flat.flatten(payload)
                return request
            },
            isAccessible: ({ currentAdmin }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin' || currentAdmin.role === 'user'
                )
            },
            component: AdminJS.bundle('../components/Statement.jsx'),
        },
        list: {
            isAccessible: true,
            component: AdminJS.bundle('../components/StatementSummaryList.jsx')
        },
        search: {
            before: async(request, context) => {
                const { currentAdmin } = context
                const { query = {} } = request
                query['filters.period'] = currentAdmin.period
                query['filters.matched'] = false
                request.query = query
                //const { filters: customFilters } = AdminJS.flat.unflatten(query)
                return request
            }
        },
        edit: {
            isAccessible: ({ currentAdmin }) => {
                return false
            },
        },
        show: {
            showInDrawer: true
        },
        delete: {
            isAccessible: true
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
                await record.update({ status: 'approved' })
                return { 
                    record: record.toJSON(currentAdmin),
                    notice: { message: 'Approval done', type: 'success' }
                }
            }
        },
        bulkApprove: {
            actionType: 'bulk',
            isAccessible: ({ currentAdmin, record }) => {
                return (currentAdmin && currentAdmin.role === 'admin') 
            },
            component: false,
            handler: async(request, response, context) => {
                const { record, resource, currentAdmin, h } = context
                const statementModel = mongoose.connection.models['StatementSummary']
                await Promise.all(request.query.recordIds.split(',').map(async (recordId) => {
                    await statementModel.findByIdAndUpdate(recordId, {
                        status: 'approved'
                    })
                }))
                return {
                    records: [new AdminJS.BaseRecord({}, context.resource).toJSON(context.currentAdmin)],
                    notice: { message: 'Bulk approve completed', type: 'success' },
                    redirectUrl: h.listUrl('StatementSummary')
                }
            }
        },
    }
}

module.exports = StatementSummaryResource