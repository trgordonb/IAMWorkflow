const CurrencyPairResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        name: { isVisible: true },
        quote: { isVisible: true },
        base: { isVisible: true },
        defaultValue: { isVisible: true }
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

module.exports = CurrencyPairResource