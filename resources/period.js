const AdminJS = require('adminjs')

const PeriodResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        factor: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        start: {
            type: 'date',
            components: {
                edit: AdminJS.bundle('../components/DateControl.jsx')
            }
        },
        end: {
            type: 'date',
            components: {
                edit: AdminJS.bundle('../components/DateControl.jsx')
            }
        },
        subPeriodEndDates: {
            isVisible: { list: true, filter: false, show: true, edit: true }
        },
        'subPeriodEndDates.date': {
            type: 'date'
        },
        exchangeRates: {
            isVisible: { list: false, filter: false, show: true, edit: true }
        }
    },
    actions: {
        list: {
            isAccessible: ({ currentAdmin }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin' || currentAdmin.role === 'user'
                )
            },
        },
        new: {
            showInDrawer: true,
            layout: [
                ['name', { ml: 'xxl'}], 
                [{ flexDirection: 'row', flex: true, ml: 'xxl' }, [
                    ['start', { pr: 'default', flexGrow: 1 }],
                    ['end', { flexGrow: 1 }],
                ]], 
                ['subPeriodEndDates', {ml: 'xxl'}],
                ['exchangeRates', {ml: 'xxl'}]
            ]
        },
        edit: {
            showInDrawer: true,
            layout: [
                ['name', { ml: 'xxl'}], 
                [{ flexDirection: 'row', flex: true, ml: 'xxl' }, [
                    ['start', { pr: 'default', flexGrow: 1 }],
                    ['end', { flexGrow: 1 }],
                ]], 
                ['subPeriodEndDates', {ml: 'xxl'}],
                ['exchangeRates', {ml: 'xxl'}]
            ]
        },
        show: {
            showInDrawer: true
        }
    }
}

module.exports = PeriodResource