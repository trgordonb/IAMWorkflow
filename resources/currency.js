const CurrencyResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        }
    },
    actions: {
        list: {
            isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user'),
        },
        edit: {
            showInDrawer: true
        },
        new: {
            showInDrawer: true
        },
        show: {
            showInDrawer: true
        }
    }
}

module.exports = CurrencyResource