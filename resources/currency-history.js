const CurrencyHistoryResource = {
    properties: {
        date: {
            type: 'date'
        },
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
    },
}

module.exports = CurrencyHistoryResource