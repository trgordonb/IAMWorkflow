const AdminJS = require('adminjs')
const AssetAllocation = require('../models/asset-allocation.model')

const AllAssetAllocationResource = {
    id: 'AllAssetAllocation',
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        recordEnteredBy: {
            isVisible: { list: false, filter: false, show: true, edit: false },
        },
        isReconciled: {
            isVisible: { list: false, filter: true, show: true, edit: false },
        },
        date: {
            type: 'date',
            isVisible: { list: true, filter: true, show: true, edit: true },
        },
        currency: {
            isVisible: { list: false, filter: true, show: true, edit: true },
        },
        total: {
            isVisible: { list: true, filter: false, show: true, edit: false }
        },
        totalValueAlert: {
            isVisible: { list: false, filter: true, show: true, edit: false }
        },
        totalPercentChange: {
            isVisible: { list: false, filter: false, show: true, edit: false }
        }
    },
    actions: {
        new: {
            before: async (request, context) => {
                const { currentAdmin } = context
                const cash = request.payload.cash ? parseFloat(request.payload.cash) : 0
                const forwards = request.payload.forwards ? parseFloat(request.payload.forwards) : 0
                const bonds = request.payload.bonds ? parseFloat(request.payload.bonds) : 0
                const equities = request.payload.equities ? parseFloat(request.payload.equities) : 0
                const alternate = request.payload.alternate ? parseFloat(request.payload.alternate) : 0
                const total =  cash + forwards + bonds + equities + alternate 
                const previousRecords = await AssetAllocation.find({accountPolicyNumber: request.payload.accountPolicyNumber})
                const latestRecord = previousRecords && previousRecords.length >= 1 ? previousRecords.reduce((prev, current) => (prev.date > current.date) ? prev : current) : undefined
                const percentChange = latestRecord ?  Math.abs((latestRecord.total - total) / latestRecord.total) * 100 : 0
                if (percentChange > 10) {
                    request.payload = {
                        ...request.payload,
                        recordEnteredBy: currentAdmin.id,
                        totalValueAlert: true,
                        totalPercentChange: Math.round(percentChange * 100, 2) / 100
                    }
                } else {
                    request.payload = {
                        ...request.payload,
                        recordEnteredBy: currentAdmin.id,
                        totalValueAlert: false,
                        totalPercentChange: Math.round(percentChange * 100, 2) / 100
                    }  
                }
                return request
            },
            isAccessible: ({ currentAdmin }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin' || currentAdmin.role === 'user'
                )
            },
            showInDrawer: true
        },
        stat: {
            actionType: 'resource',
            isVisible: true,
            isAccessible: true,
            component: false,
            handler: async(request, response, context) => {
                const records = await AssetAllocation.find({totalValueAlert: true, isReconciled : false})
                return { data: records ? records.length : 0 }
            }
        },
        edit: {
            before: async (request, context) => {
                const { currentAdmin } = context
                const cash = request.payload.cash ? parseFloat(request.payload.cash) : 0
                const forwards = request.payload.forwards ? parseFloat(request.payload.forwards) : 0
                const bonds = request.payload.bonds ? parseFloat(request.payload.bonds) : 0
                const equities = request.payload.equities ? parseFloat(request.payload.equities) : 0
                const alternate = request.payload.alternate ? parseFloat(request.payload.alternate) : 0
                const total =  cash + forwards + bonds + equities + alternate 
                const previousRecords = await AssetAllocation.find({accountPolicyNumber: request.payload.accountPolicyNumber, date: {$lt: request.payload.date}})
                const latestRecord = previousRecords && previousRecords.length >= 1 ? previousRecords.reduce((prev, current) => (prev.date > current.date) ? prev : current) : undefined
                const percentChange = latestRecord ?  Math.abs((latestRecord.total - total) / latestRecord.total) * 100 : 0
                if (percentChange > 10) {
                    request.payload = {
                        ...request.payload,
                        recordEnteredBy: currentAdmin.id,
                        totalValueAlert: true,
                        totalPercentChange: Math.round(percentChange * 100, 2) / 100
                    }
                } else {
                    request.payload = {
                        ...request.payload,
                        recordEnteredBy: currentAdmin.id,
                        totalValueAlert: false,
                        totalPercentChange: Math.round(percentChange * 100, 2) / 100
                    }  
                }
                return request
            },
            isAccessible: ({ currentAdmin, record }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin'
                  || (currentAdmin.id === record.param('recordEnteredBy') && !record.param('isReconciled'))
                )
            },
            showInDrawer: true
        },
        delete: {
            isAccessible: ({ currentAdmin, record }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin'
                  || (currentAdmin.id === record.param('recordEnteredBy') && !record.param('isReconciled'))
                )
            }
        },
        bulkDelete: {
            isAccessible: false
        },
    }
}

module.exports = AllAssetAllocationResource 