const AdminJS = require('adminjs')
const mongoose = require('mongoose')

const BankStatementItemResource = {
    id: 'BankStatementItem',
    actions: {
        new: {
            isAccessible: ({ currentAdmin, record }) => {
                return ((currentAdmin && currentAdmin.role === 'admin') || (currentAdmin && currentAdmin.role === 'user')) && currentAdmin.period
            },
            before: async(request, context) => {
                const { currentAdmin } = context
                let statementSummaryModel = mongoose.connection.models['StatementSummary']
                await statementSummaryModel.findByIdAndUpdate(request.payload.matchedStatement, {
                    matched: true
                })
                request.payload = {
                    ...request.payload,
                    period: currentAdmin.period,
                    status: 'pending',
                }
                return request
            },
            component: AdminJS.bundle('../components/BankStatementItem.jsx')
        },
        edit: {
            before: async(request) => {
                console.log('Payload:',request.payload)
                return request
            },
            isAccessible: ({ currentAdmin, record }) => {
                return ((currentAdmin && currentAdmin.role === 'admin') || (currentAdmin && currentAdmin.role === 'user' && !record.param('isLocked')))
            },
            component: AdminJS.bundle('../components/BankStatementItem.jsx')
        },
        list: {
            isAccessible: true
        },
        show: {
            showInDrawer: true
        },
        delete: {
            isAccessible: true
        },
        bulkDelete: {
            isAccessible: false
        },
        approve: {
            actionType: 'record',
            isAccessible: ({ currentAdmin, record }) => {
                return (currentAdmin && currentAdmin.role === 'admin') 
            },
            component: false,
            handler: async(request, response, context) => {
                const { record, resource, currentAdmin } = context
                await record.update({ status: 'approved' })
                return { 
                    record: record.toJSON(currentAdmin),
                    notice: { message: 'Approval done', type: 'success' }
                }
            }
        },
        bulkApprove: {
            actionType: 'bulk',
            isAccessible: ({ currentAdmin, record }) => {
                return (currentAdmin && currentAdmin.role === 'admin') 
            },
            component: false,
            handler: async(request, response, context) => {
                const { record, resource, currentAdmin, h } = context
                const statementModel = mongoose.connection.models['BankStatementItem']
                await Promise.all(request.query.recordIds.split(',').map(async (recordId) => {
                    await statementModel.findByIdAndUpdate(recordId, {
                        status: 'approved'
                    })
                }))
                return {
                    records: [new AdminJS.BaseRecord({}, context.resource).toJSON(context.currentAdmin)],
                    notice: { message: 'Bulk approve completed', type: 'success' },
                    redirectUrl: h.listUrl('BankStatementItem')
                }
            }
        },
        /**reconcile: {
            actionType: 'resource',
            isVisible: false,
            isAccessible: true,
            component: false,
            handler: async(request, resource, context) => {
                const statementItems = await BankStatementItem.find({bankstatementId: request.payload.statementId}).populate('statement')
                let unmatched = []
                await Promise.all(statementItems.map(async (item) => {
                    const alreadyReconciled = item.statement.bankStatementitem ? true: false
                    if (!alreadyReconciled) {
                        const sourcegrossamt = item.grossamount
                        const targetgrossamt = item.statement.grossamount
                        if (item.currency.toString() !== item.statement.currency.toString()) {
                            unmatch.push(item.statement.reference)
                        } else if (sourcegrossamt !== targetgrossamt) {
                            unmatch.push(item.statement.reference)
                        } else {
                            item.isLocked = true
                            await item.save()
                            let statement = await Statement.findById(item.statement._id)
                            statement.bankcharges = item.bankcharges
                            statement.netamount = item.netamount
                            statement.bankStatementitem = item._id
                            await statement.save()
                        }
                    }
                }))
                if (unmatched.length === 0) {
                    return { notice: { message: 'OK', type: 'success', data: [] } }
                } else {
                    return { notice: { message: 'Fail', type: 'error', data: unmatched } }
                }   
            }
        }*/
    },
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        bank: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            position: 1
        },
        bankStatementRef: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            position: 2
        },
        period: {
            isVisible: { list: false, filter: true, show: true, edit: false },
            position: 3
        },
        statementDate: {
            type: 'date',
            isVisible: { list: false, filter: true, show: true, edit: true },
            position: 4,
            components: { 
                edit: AdminJS.bundle('../components/DateControl.jsx')
            },
        },
        currency: {
            isVisible: { list: false, filter: true, show: true, edit: true },
            position: 5
        },
        grossAmount: {
            isVisible: { list: false, filter: false, show: true, edit: true },
            position: 8
        },
        itemCharge: {
            isVisible: { list: false, filter: false, show: true, edit: true },
            position: 9
        },
        companyAccount: {
            isVisible: { list: false, filter: true, show: true, edit: true },
            position: 6,
        },
        counterParty: {
            isVisible: { list: false, filter: true, show: true, edit: true },
            position: 7,
        },
        status: {
            isVisible: { list: true, filter: true, show: true, edit: false },
            position: 11
        },
        isLocked: {
            isVisible: { list: true, filter: true, show: true, edit: false },
            position: 12
        },
        matchedStatement: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            position: 13
        },
        remark: {
            type: 'textarea',
            isVisible: { list: false, filter: false, show: true, edit: true },
            position: 14
        }
    }
}

module.exports = BankStatementItemResource