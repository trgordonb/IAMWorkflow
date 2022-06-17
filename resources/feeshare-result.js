const FeeShareResultResource = {
    actions: {
        new: {
            actionType: 'record',
            isAccessible: false
        },
        edit: {
            actionType: 'record',
            isAccessible: false
        },
        delete: {
            actionType: 'record',
            isAccessible: false
        },
        bulkDelete: {
            actionType: 'resource',
            isAccessible: false
        },
        show: {
            showInDrawer: true
        }
    },
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        statementItem: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        custodianAccount: {
            isVisible: { list: true, filter: true, show: true, edit: false },
        },
        amount: {
            isVisible: { list: true, filter: false, show: true, edit: false },
        },
        currency: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        period: {
            isVisible: { list: true, filter: true, show: true, edit: false },
        },
        type: {
            isVisible: { list: true, filter: true, show: true, edit: false },
        },
        feeShares: {
            isVisible: { list: false, filter: false, show: true, edit: false },
        }
    }
}

module.exports = FeeShareResultResource