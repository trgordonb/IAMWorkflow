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
            type: 'date',
        }
    },
    actions: {
        list: {
            isAccessible: true
        },
        new: {
            showInDrawer: true,
            layout: [
                ['name', { ml: 'xxl'}], 
                [{ flexDirection: 'row', flex: true, ml: 'xxl' }, [
                    ['start', { pr: 'default', flexGrow: 1 }],
                    ['end', { flexGrow: 1 }],
                ]], 
                ['subPeriodEndDates', {ml: 'xxl'}]
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
                ['subPeriodEndDates']
            ]
        },
        show: {
            showInDrawer: true
        }
    }
}

module.exports = PeriodResource