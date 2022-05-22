const PolicyFeeSettingResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        accountnumber: {
            isVisible: { list: true, filter: true, show: true, edit: true },
        },
        custodian: {
            isVisible: { list: true, filter: true, show: true, edit: true },
        },
        accountopendate: {
            type: 'date',
            isVisible: { list: false, filter: false, show: true, edit: true },
        },
        accountenddate: {
            type: 'date',
            isVisible: { list: false, filter: false, show: true, edit: true },
        },
        accountstatus: {
            isVisible: { list: true, filter: true, show: true, edit: true },
        },
        discretionarymanage: {
            isVisible: { list: false, filter: false, show: true, edit: true },
        },
        advisorfee: {
            isVisible: { list: false, filter: false, show: true, edit: true },
        },
        retrocession: {
            isVisible: { list: false, filter: false, show: true, edit: true },
        }
    },
    actions: {
        list: {
            isAccessible: false
        }
    }
}

module.exports = PolicyFeeSettingResource