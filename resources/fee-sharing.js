const FeeSharingResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        feerecipients: {
            isVisible: { list: false, filter: false, show: true, edit: true }
        }
    }
}

module.exports = FeeSharingResource