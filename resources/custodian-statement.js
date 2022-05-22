const AdminJS = require('adminjs')
const CustodianStatement = require('../models/custodian-statement-model')

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
            isVisible:{ list: false, filter: false, show: true, edit: true }
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
        }
    },
    actions: {
        new: {
            before: async (request, context) => {
                const { currentAdmin } = context
                request.payload = {
                    ...request.payload,
                    recordEnteredBy: currentAdmin.id,
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
            showInDrawer: false,
        },
        bulkDelete: {
            isAccessible: false
        },
    }
}

module.exports = CustodianStatementResource 