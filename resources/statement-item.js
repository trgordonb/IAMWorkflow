const AdminJS = require('adminjs')

const StatementItemResource = {
    id: 'StatementItem',
    properties: {
        _id: {
            isVisible: false
        },
        custodianAccount: {
            isVisible: false
        },
        amount: {
            isVisible: false
        },
        currency: {
            isVisible: false
        },
        tag: {
            isVisible: false
        },
        reconcilation: {
            isVisible: false
        }
    },
    actions: {
        list: {
            isAccessible: false
        },
        new: {
            isAccessible: false,
        },
        edit: {
            isAccessible: false
        },
        show: {
            showInDrawer: false
        },
        delete: {
            isAccessible: false
        },
        bulkDelete: {
            isAccessible: false
        }
    }
}

module.exports = StatementItemResource