const FeeCodeResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        }
    },
    actions: {
        list: {
            isAccessible: true
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

module.exports = FeeCodeResource