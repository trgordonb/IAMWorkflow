const AccountFeeResource = {
    properties: {
        startDate: {
            type: 'date'
        },
        endDate: {
            type: 'date'
        },
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        }
    },
    actions: {
        list: {
            isAccessible: false
        }
    }
}

module.exports = AccountFeeResource