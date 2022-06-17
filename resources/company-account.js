const CompanyAccountResource = {
    id: 'CompanyAccount',
    properties: {
        _id : {
            isVisible: { list: false, filter: false, show: false, edit: false },
        }
    },
    actions: {
        list: {
            isAccessible: true
        },
        new: {
            showInDrawer: true
        },
        show: {
            showInDrawer: true
        },
        edit: {
            showInDrawer: true
        }
    }
}

module.exports = CompanyAccountResource