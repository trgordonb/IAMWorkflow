const AccountPolicyResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        accountNumber: {
            isVisible: true,
            position: 1
        },
        customer: {
            isVisible: true,
            position: 2
        },
        custodian: {
            isVisible: true,
            position: 3
        },
        currency: {
            isVisible: true,
            position: 4
        },
        status: {
            isVisible: true,
            position: 6
        },
        accountStartDate: {
            type: 'date',
            position: 5,
            isVisible: { list: false, filter: false, show: true, edit: true },
        },
        accountCloseDate: {
            type: 'date',
            position: 7,
            isVisible: { list: false, filter: false, show: true, edit: true },
        },
        feeSharing: {
            position: 8,
            isVisible: { list: false, filter: false, show: true, edit: true },
        },
        'feeSharing.feeType': {
            isVisible: { list: false, filter: false, show: true, edit: true }
        },
        'feeSharing.feeSharingScheme': {
            isVisible: { list: false, filter: false, show: true, edit: true }
        }
    },
    actions: {
        new: {
            isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user'),
            showInDrawer: true
        },
        edit: {
            isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user'),
            showInDrawer: true
        },
        show: {
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

module.exports = AccountPolicyResource