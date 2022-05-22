const FeeSharingResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        feerecipients: {
            isVisible: { list: false, filter: false, show: true, edit: true }
        },
    },
    actions: {
        list: {
            isAccessible: false
        }
    }
}

module.exports = FeeSharingResource