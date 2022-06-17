const BankResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        }
    },
    actions: {
        list: {
            isAccessible: true
        },
        new: {
            showInDrawer: true
        }
    }
}

module.exports = BankResource