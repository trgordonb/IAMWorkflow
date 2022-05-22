const PeriodResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        factor: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        start: {
            type: 'date'
        },
        end: {
            type: 'date'
        }
    },
    actions: {
        list: {
            isAccessible: false
        }
    }
}

module.exports = PeriodResource