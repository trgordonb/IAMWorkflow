const AccountCustodianResource = {
    properties: {
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

module.exports = AccountCustodianResource