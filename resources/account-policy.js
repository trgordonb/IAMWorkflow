const AdminJS = require('adminjs')
const mongoose = require('mongoose')

const AccountPolicyResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        accountNumber: {
            isVisible: true,
            position: 1
        },
        customer: {
            isVisible: true,
            position: 2
        },
        custodian: {
            isVisible: true,
            position: 3
        },
        currency: {
            isVisible: true,
            position: 4
        },
        status: {
            isVisible: true,
            position: 6
        },
        accountStartDate: {
            type: 'date',
            position: 5,
            isVisible: { list: false, filter: false, show: true, edit: true },
        },
        accountCloseDate: {
            type: 'date',
            position: 7,
            isVisible: { list: false, filter: false, show: true, edit: true },
        },
        feeSharing: {
            position: 8,
            isVisible: { list: false, filter: false, show: true, edit: true },
        },
        'feeSharing.feeType': {
            isVisible: { list: false, filter: false, show: true, edit: true }
        },
        'feeSharing.feeSharingScheme': {
            isVisible: { list: false, filter: false, show: true, edit: true }
        }
    },
    actions: {
        new: {
            isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user'),
            showInDrawer: true,
            after: async(response, request, context) => {
                const { record } = context
                let orgRecord = AdminJS.flat.get(record.params)
                let customerPortfolioModel = mongoose.connection.models['CustomerPortfolio']
                let existingPortfolio = await customerPortfolioModel.find({
                    customer: orgRecord.customer,
                    status: 'Active'
                }).populate('accountPolicyNumber')
                if (existingPortfolio.length === 0) {
                    let newPortfolioRecord = {}
                    newPortfolioRecord.status = 'Active'
                    newPortfolioRecord.customer = orgRecord.customer
                    newPortfolioRecord.startDate = orgRecord.accountStartDate
                    newPortfolioRecord.currency = orgRecord.currency
                    newPortfolioRecord.startUnit = 0
                    newPortfolioRecord.startNAV = 0
                    newPortfolioRecord.accountPolicyNumber = [orgRecord._id]
                    const portfolioRecord = new customerPortfolioModel(newPortfolioRecord)
                    await portfolioRecord.save()
                } else if (existingPortfolio.length === 1) {
                    let policyAlreadyExist = false
                    existingPortfolio[0].accountPolicyNumber.forEach(item => {
                        if (item.accountNumber === orgRecord.accountNumber) {
                            policyAlreadyExist = true
                        }
                    });
                    if (!policyAlreadyExist) {
                        existingPortfolio[0].accountPolicyNumber.push(orgRecord._id)
                        await existingPortfolio[0].save()
                    }
                }
                return response
            },
        },
        edit: {
            isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user'),
            showInDrawer: true
        },
        show: {
            isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user'),
            showInDrawer: true
        },
        delete: {
            isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user'),
        },
        bulkDelete: {
            isAccessible: ({ currentAdmin }) => currentAdmin && (currentAdmin.role === 'admin' || currentAdmin.role === 'user'),
        }
    }
}

module.exports = AccountPolicyResource