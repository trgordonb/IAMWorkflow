const AdminJS = require('adminjs')

const DemandNoteItemResource = {
    id: 'DemandNoteItem',
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        period: {
            isVisible: { list: true, filter: true, show: true, edit: false },
            position: 1
        },
        custodian: {
            isVisible: { list: true, filter: true, show: true, edit: false },
            position: 2
        },
        custodianAccount: {
            isVisible: { list: true, filter: true, show: true, edit: false },
            position: 3
        },
        accountNAV: {
            isVisible: { list: true, filter: false, show: true, edit: false },
            position: 4
        },
        factor: {
            isVisible: { list: false, filter: false, show: true, edit: false },
            position: 5
        },
    },
    actions: {
        list: {
            isAccessible: true
        },
        new: {
            isAccessible: false
        },
        edit: {
            isAccessible: false
        },
        show: {
            showInDrawer: true
        },
        delete: {
            isAccessible: false
        },
        bulkDelete: {
            isAccessible: false
        }
    }
}

module.exports = DemandNoteItemResource