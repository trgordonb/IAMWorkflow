const AdminJS = require('adminjs')
const CustomerTransaction = require('../models/customer-transaction.model')

const CustomerTransactionResource = {
    id: 'CustomerTransaction',
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        recordEnteredBy: {
            isVisible: { list: false, filter: false, show: true, edit: false },
        },
        isReconciled: {
            isVisible: { list: false, filter: true, show: true, edit: false },
        },
        nominalValue: {
            isVisible: { list: true, filter: false, show: true, edit: true },
        },
        currency: {
            isVisible: { list: true, filter: true, show: true, edit: true },
        },
        date: {
            type: 'date',
            isVisible: { list: true, filter: true, show: true, edit: true },
        },
        remark: {
            isVisible: { list: false, filter: false, show: true, edit: true},
        }
    },
    actions: {
        new: {
            isAccessible: false
        },
        list: {
            isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
            before: async (request, context) => {
                const { currentAdmin } = context
                return {
                    ...request,
                    query: {
                       ...request.query,
                       'filters.isReconciled': false
                    }
                }
            }
        },
        edit: {
            isAccessible: ({ currentAdmin, record }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin'
                  || (currentAdmin.id === record.param('recordEnteredBy') && !record.param('isReconciled'))
                )
            }
        },
        delete: {
            isAccessible: false
        },
        bulkDelete: {
            isAccessible: false
        },
        bulkApprove: {
            actionType: 'bulk',
            component: AdminJS.bundle('../components/Approval'),
            handler: async(request, response, context) => {
                const recordIds = request.query.recordIds.split(',')
                await Promise.all(recordIds.map(async (id) => {
                    let record = await CustomerTransaction.findById(id)
                    record.isReconciled = true
                    await record.save()
                }))
                return {records: [new AdminJS.BaseRecord({}, context.resource).toJSON(context.currentAdmin)] }
            }
        }
    }
}

module.exports = CustomerTransactionResource