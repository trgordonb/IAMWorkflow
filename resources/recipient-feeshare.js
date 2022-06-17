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
        }
    }
}

module.exports = RecipientFeeShareResource