const AccountPolicy = require('../models/account-policy')
const AccountLedgerBalance = require('../models/account-ledger-balance.model')
const AdminJS = require('adminjs')

const AccountLedgerBalanceResource = {
    actions: {
        new: {
            before: async (request, context) => {
                const { currentAdmin } = context
                if (request.payload) {
                    request.payload = {
                        ...request.payload,
                        lastModifiedBy: currentAdmin._id
                    }
                }
                return request
            }
        },
        edit: {
            actionType: 'record',
            isAccessible: ({ currentAdmin, record }) => {
                return true
                //return ((currentAdmin && currentAdmin.role === 'admin') || (currentAdmin && currentAdmin.role === 'user' && !record.param('isLocked')))
            },
            before: async (request, context) => {
                const { currentAdmin, record } = context
                if (request.payload && currentAdmin) {
                    request.payload = {
                        ...request.payload,
                        lastModifiedBy: currentAdmin._id
                    }
                } 
                return request
            }
        },
        list: {
            isAccessible: false
        },
        delete: {
            actionType: 'record',
            isAccessible: ({ currentAdmin, record }) => {
                return ((currentAdmin && currentAdmin.role === 'admin') || (currentAdmin && currentAdmin.role === 'user' && !record.param('isLocked')))
            },
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
        import: {
            actionType: 'resource',
            isVisible: true,
            handler: async(request, response, data) => {
                try {
                    let records = JSON.parse(request.payload.payload)
                    records.forEach(record => {
                        AccountPolicy.findOne({number: record.accountnumber}, async (err, doc) => {
                            record.accountnumber = doc._id,
                            record.AUM = parseFloat(record.AUM),
                            record.NAVDate = new Date(record.NAVDate)
                            record.currency = doc.currency
                            const ledgerRecord = new AccountLedgerBalance(record)
                            await ledgerRecord.save()
                        })                  
                    })
                    return {
                        notice: {
                            message: 'OK',
                            type: 'success'
                        }
                    }
                } catch (err) {
                    return {
                        notice: {
                            message: 'Fail',
                            type: 'error'
                        }
                    }
                }                                       
            }
        }
    },
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        accountnumber: {
            isVisible: { list: true, filter: true, show: true, edit: true },
        },
        NAVDate: {
            type: 'date',
            isVisible: { list: true, filter: true, show: true, edit: true },
        },
        tag: {
            isVisible: { list: true, filter: true, show: true, edit: true },
        },
        AUM: {
            isVisible: { list: true, filter: false, show: true, edit: true },
        },
        currency: {
            isVisible: { list: true, filter: true, show: true, edit: true },
        },
        estimatedfee: {
            isVisible: { list: false, filter: false, show: true, edit: true },
        },
        overrideAdvisorFee: {
            isVisible: { list: false, filter: false, show: true, edit: true },
        },
        advisorfee: {
            isVisible: { list: false, filter: false, show: true, edit: true },
        },
        retrocession: {
            isVisible: { list: false, filter: false, show: true, edit: true },
        },
        lastModifiedBy: {
            isVisible: { list: false, filter: false, show: true, edit: false },
        },
        lastModifiedTime: {
            isVisible: { list: false, filter: false, show: true, edit: false },
        },
        isLocked: {
            isVisible: { list: false, filter: false, show: true, edit: true },
        },
        reconcileStatus: {
            isVisible: { list: false, filter: false, show: true, edit: false },
        }
    },
}

module.exports = AccountLedgerBalanceResource