const CustomerResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        clientId: {
            isTitle: true,
            position: 1,
            isVisible: { list: true, filter: true, show: true, edit: true },
        },
        name: {
            position: 2,
            isVisible: { list: true, filter: true, show: true, edit: true },
        },
        bankaccountnumber: {
            position: 5,
            isVisible: { list: false, filter: true, show: true, edit: true },
        },
        address: {
            position: 6,
            isVisible: { list: false, filter: false, show: true, edit: true },
        },
        mobile: {
            position: 4,
            isVisible: { list: false, filter: false, show: true, edit: true },
        },
        email: {
            position: 3,
            isVisible: { list: true, filter: true, show: true, edit: true },
        }
    },
    actions: {
        new: {
            isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user'),
            showInDrawer: true
        },
        show: {
            showInDrawer: true
        },
        edit: {
            isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user'),
            showInDrawer: true
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