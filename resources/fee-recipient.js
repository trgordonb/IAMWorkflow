const AdminJS = require('adminjs')

const FeeRecipientResource = {
    id: 'FeeRecipient',
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        name: {
            isVisible: { list: true, filter: false, show: true, edit: true },
            isTitle: true,
            position: 1
        },
        isCompany: {
            isVisible: true,
            position: 2
        },
        company: {
            isVisible: { list: false, filter: true, show: true, edit: true },
            position: 3
        },
        entity: {
            isVisible: { list: false, filter: true, show: true, edit: true },
            position: 4
        }
    },
    actions: {
        edit: {
            showInDrawer: true,
            component: AdminJS.bundle('../components/FeeRecipient.jsx')
        },
        new: {
            showInDrawer: true,
            component: AdminJS.bundle('../components/FeeRecipient.jsx')
        },
        show: {
            showInDrawer: true
        }
    }
}

module.exports = FeeRecipientResource