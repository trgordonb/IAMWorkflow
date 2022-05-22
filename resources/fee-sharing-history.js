const FeeSharingHistoryResource = {
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
        list: {
            isAccessible: false
        }
    },
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        }
    }
}

module.exports = FeeSharingHistoryResource