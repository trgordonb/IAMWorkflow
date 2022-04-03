const AdminJS = require('adminjs')
const AssetAllocation = require('../models/asset-allocation.model')

const AssetAllocationResource = {
    id: 'AssetAllocation',
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
            isVisible: { list: false, filter: true, show: true, edit: true },
        },
        total: {
            isVisible: { list: true, filter: false, show: true, edit: false },
        },
        totalValueAlert: {
            isVisible: { list: false, filter: true, show: true, edit: false },
        }
    },
    actions: {
        new: {
            isAccessible: false
        },
        list: {
            isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
            before: async (request, context) => {
                const { currentAdmin } = context
                return {
                    ...request,
                    query: {
                       ...request.query,
                       'filters.isReconciled': false
                    }
                }
            }
        },
        edit: {
            isAccessible: ({ currentAdmin, record }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin'
                  || (currentAdmin.id === record.param('recordEnteredBy') && !record.param('isReconciled'))
                )
            }
        },
        delete: {
            isAccessible: false
        },
        bulkDelete: {
            isAccessible: false
        },
        bulkApprove: {
            actionType: 'bulk',
            component: AdminJS.bundle('../components/Approval'),
            handler: async(request, response, context) => {
                const recordIds = request.query.recordIds.split(',')
                await Promise.all(recordIds.map(async (id) => {
                    let record = await AssetAllocation.findById(id)
                    record.isReconciled = true
                    await record.save()
                }))
                return {records: [new AdminJS.BaseRecord({}, context.resource).toJSON(context.currentAdmin)] }
            }
        }
    }
}

module.exports = AssetAllocationResource 