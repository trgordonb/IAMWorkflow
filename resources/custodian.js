const CustodianResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        name: {
            isVisible: true,
            position: 1
        },
        currency: {
            isVisible: true,
            position: 2
        }
    },
    actions: {
        list: {
            isAccessible: true
        },
        edit: {
            showInDrawer: true
        },
        show: {
            showInDrawer: true
        },
        new: {
            showInDrawer: true
        }
    }
}

module.exports = CustodianResource