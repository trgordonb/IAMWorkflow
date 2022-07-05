const AdminJS = require('adminjs')

const RecipientFeeShareResource = {
    id: 'RecipientFeeShare',
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        recipient: {
            isVisible: { list: true, filter: true, show: true, edit: false }
        },
        period: {
            isVisible: { list: true, filter: true, show: true, edit: false }
        },
        currency: {
            isVisible: false
        },
        total: {
            isVisible: { list: true, filter: false, show: true, edit: false }
        },
        details: {
            isVisible: { list: false, filter: false, show: true, edit: false }
        }
    },
    actions: {
        new: {
            isAccessible: false
        },
        edit: {
            isAccessible: false
        },
        delete: {
            isAccessible: false
        },
        bulkDelete: {
            isAccessible: false
        },
        show: {
            showInDrawer: true
        },
        list: {
            component: AdminJS.bundle('../components/RecipientFeeShareList.jsx'),
            isAccessible: ({ currentAdmin }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin' || currentAdmin.role === 'user'
                )
            },
        }
    }
}

module.exports = RecipientFeeShareResource