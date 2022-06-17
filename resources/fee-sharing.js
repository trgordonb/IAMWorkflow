const FeeSharingResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        code: {
            isVisible: true
        },
        feerecipients: {
            isVisible: { list: false, filter: false, show: true, edit: true }
        },
    },
    actions: {
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

module.exports = FeeSharingResource