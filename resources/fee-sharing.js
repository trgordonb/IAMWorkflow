const mongoose = require('mongoose')
const AdminJS = require('adminjs')

const FeeSharingResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        code: {
            isVisible: true
        },
        feerecipients: {
            isVisible: { list: false, filter: false, show: true, edit: true }
        },
    },
    actions: {
        new: {
            showInDrawer: true,
            before: async (request) => {
                let record = AdminJS.flat.get(request.payload)
                let feeSharesComplete = false
                let total = 0
                record.feerecipients.forEach(recipient => {
                    total = total + parseFloat(recipient.percentage)
                })
                if (Math.abs(total - 100) < 0.0001) {
                    feeSharesComplete = true
                }
                if (feeSharesComplete) {
                    return request
                } else {
                    throw new AdminJS.ValidationError({
                        feerecipients: {
                          message: 'Shares do not add up to 100%',
                        },
                    }, {
                        message: 'Recipient shares do not add up to 100%',
                    })
                }
            }
        },
        edit: {
            showInDrawer: true,
            component: AdminJS.bundle('../components/FeeShareEdit.jsx')
        },
        show: {
            showInDrawer: true
        },
        validate: {
            actionType: 'resource',
            isVisible: false,
            isAccessible: true,
            component: false,
            handler: async(request, response, context) => {
                let feeShareResultModel = mongoose.connection.models['FeeShareResult']
                let count = await feeShareResultModel.count({'feeShares.scheme': request.payload.id})
                if (count === 0) {
                    return {validate: true}
                } else {
                    return {validate: false}
                }
            }
        },
        delete: {
            before: async (request) => {
                let recordId = request.params.recordId
                let feeShareResultModel = mongoose.connection.models['FeeShareResult']
                let count = await feeShareResultModel.count({'feeShares.scheme': recordId})
                if (count > 0) {
                    throw new AdminJS.ValidationError({
                        feeCode: {
                          message: 'Fee Code cannot be deleted',
                        },
                    }, {
                        message: 'This fee code has already been used to calculate fees',
                    })
                } else {
                    return request
                }
            }
        },
        list: {
            isAccessible: ({ currentAdmin }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin' || currentAdmin.role === 'user'
                )
            },
        }
    }
}

module.exports = FeeSharingResource