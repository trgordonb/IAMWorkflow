const AdminJS = require('adminjs')

const CurrencyResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        }
    },
    actions: {
        list: {
            isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user'),
            before: async(request, context) => {
                const { query = {} } = request
                const { sortBy, direction, filters = {} } = AdminJS.flat.unflatten(query || {});
                console.log(filters)
                return request
            }
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