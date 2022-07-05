const RoleResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        }
    },
    actions: {
        list: {
            isAccessible: ({ currentAdmin }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin' || currentAdmin.role === 'user'
                )
            },
        },
        new: {
            showInDrawer: true
        },
        edit: {
            showInDrawer: true
        },
        show: {
            showInDrawer: true
        }
    }
}

module.exports = RoleResource