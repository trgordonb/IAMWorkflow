const AdminJS = require('adminjs')
const CustomerTransaction = require('../models/customer-transaction.model')

const AllCustomerTransactionResource = {
    id: 'AllCustomerTransaction',
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
            before: async (request, context) => {
                const { currentAdmin } = context
                request.payload = {...request.payload, recordEnteredBy: currentAdmin.id}
                return request
            },
            isAccessible: ({ currentAdmin }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin' || currentAdmin.role === 'user'
                )
            }
        },
        edit: {
            before: async (request, context) => {
                const { currentAdmin } = context
                request.payload = {...request.payload, recordEnteredBy: currentAdmin.id}
                return request
            },
            isAccessible: ({ currentAdmin, record }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin'
                  || (currentAdmin.id === record.param('recordEnteredBy') && !record.param('isReconciled'))
                )
            }
        },
        delete: {
            isAccessible: ({ currentAdmin, record }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin'
                  || (currentAdmin.id === record.param('recordEnteredBy') && !record.param('isReconciled'))
                )
            }
        },
        bulkDelete: {
            isAccessible: false
        },
    }
}

module.exports = AllCustomerTransactionResource