const Statement = require('../models/statement.model')
const BankStatementItem = require('../models/bankstatement-item.model')
const AdminJS = require('adminjs')

const BankStatementItemResource = {
    actions: {
        edit: {
            actionType: 'record',
            before: async(request) => {
                console.log('Payload:',request.payload)
                return request
            },
            isAccessible: ({ currentAdmin, record }) => {
                return true
                //return ((currentAdmin && currentAdmin.role === 'admin') || (currentAdmin && currentAdmin.role === 'user' && !record.param('isLocked')))
            },
        },
        list: {
            isAccessible: false
        },
        bulkApprove: {
            actionType: 'bulk',
            isAccessible: ({ currentAdmin, record }) => {
                return (currentAdmin && currentAdmin.role === 'admin') 
            },
            component: AdminJS.bundle('../components/Approval'),
            handler: async(request, response, context) => {
                return {records: [new AdminJS.BaseRecord({}, context.resource).toJSON(context.currentAdmin)] }
            }
        },
        reconcile: {
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
        }
    },
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        date: {
            type: 'date',
            isVisible: { list: false, filter: true, show: true, edit: true },
        },
        netamount: {
            isVisible: { list: false, filter: false, show: true, edit: false },
        },
        party: {
            isVisible: { list: false, filter: true, show: true, edit: true },
        },
        isLocked: {
            isVisible: { list: true, filter: true, show: true, edit: false },
        }
    }
}

module.exports = BankStatementItemResource