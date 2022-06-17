const EntityResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        name: {
            isVisible: { list: true, filter: false, show: true, edit: true },
        }
    },
    actions: {
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

module.exports = EntityResource