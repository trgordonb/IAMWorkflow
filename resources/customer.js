const CustomerResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        clientId: {
            isTitle: true,
            isVisible: { list: true, filter: true, show: true, edit: true },
        },
        bankaccountnumber: {
            isVisible: { list: false, filter: true, show: true, edit: true },
        },
        address: {
            isVisible: { list: false, filter: false, show: true, edit: true },
        },
        mobile: {
            isVisible: { list: false, filter: false, show: true, edit: true },
        },
        email: {
            isVisible: { list: false, filter: true, show: true, edit: true },
        }
    },
    actions: {
        new: {
            isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user'),
        },
        edit: {
            isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user'),
        },
        delete: {
            isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user'),
        },
        bulkDelete: {
            isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user'),
        }
    }
}

module.exports = CustomerResource