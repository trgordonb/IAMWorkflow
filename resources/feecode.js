const AdminJS = require('adminjs')
const mongoose = require('mongoose')

const FeeCodeResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
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
        edit: {
            showInDrawer: true,
            component: AdminJS.bundle('../components/FeeCodeEdit.jsx'),
        },
        validate: {
            actionType: 'resource',
            isVisible: false,
            isAccessible: true,
            component: false,
            handler: async(request, response, context) => {
                let statementItemModel = mongoose.connection.models['StatementItem']
                let count = await statementItemModel.count({feeCodeApplied: request.payload.id})
                if (count === 0) {
                    return {validate: true}
                } else {
                    return {validate: false}
                }
            }
        },
        new: {
            showInDrawer: true
        },
        show: {
            showInDrawer: true
        },
        delete: {
            before: async (request) => {
                let recordId = request.params.recordId
                let statementItemModel = mongoose.connection.models['StatementItem']
                let count = await statementItemModel.count({feeCodeApplied: recordId})
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
        }
    }
}

module.exports = FeeCodeResource