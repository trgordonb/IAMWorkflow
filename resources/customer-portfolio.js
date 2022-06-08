const AdminJS = require('adminjs')

const CustomerPortfolioResource = {
    id: 'CustomerPortfolio',
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        startDate: {
            type: 'date',
            position: 1,
            components: {
                edit: AdminJS.bundle('../components/DateControl.jsx')
            },
            isVisible: true
        },
        customer: {
            position: 2,
            isVisible: true
        },
        currency: {
            position: 3,
            isVisible: true
        },
        startUnit: {
            position: 4,
            isVisible: true
        },
        startNAV: {
            position: 5,
            isVisible: true
        },
        accountPolicyNumber: {
            position: 6,
            isVisible: {
                list: false, filter: false, show: true, edit: true
            }
        },
        status: {
            position: 7,
            isVisible: true,
        },
        endDate: {
            type: 'date',
            position: 7,
            isVisible: {
                list: false, filter: false, show: true, edit: true
            },
            components: {
                edit: AdminJS.bundle('../components/DateControl.jsx')
            },
        }
    },
    actions: {
        new: {
            isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user'),
            showInDrawer: true,
            layout: [
                ['startDate', { ml: 'xxl' }], 
                ['customer', { ml: 'xxl' }],
                ['currency', { ml: 'xxl' }],
                ['startUnit', { ml: 'xxl' }],
                ['startNAV', { ml: 'xxl' }],
                ['accountPolicyNumber', { ml: 'xxl' }],
                ['status', {ml: 'xxl'}]
            ]
        },
        edit: {
            isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user'),
            showInDrawer: true,
            layout: [
                ['startDate', { ml: 'xxl' }], 
                ['customer', { ml: 'xxl' }],
                ['currency', { ml: 'xxl' }],
                ['startUnit', { ml: 'xxl' }],
                ['startNAV', { ml: 'xxl' }],
                ['accountPolicyNumber', { ml: 'xxl' }],
                ['endDate', { ml: 'xxl'}],
                ['status', {ml: 'xxl'}]
            ]
        },
        delete: {
            isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user'),
        },
        bulkDelete: {
            isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user'),
        },
        list: {
            isAccessible: true
        },
        show: {
            showInDrawer: true
        }
    }
}

module.exports = CustomerPortfolioResource