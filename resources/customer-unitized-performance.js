const AdminJS = require('adminjs')
const CustomerPortfolio = require('../models/customer-portfolio.model')
const CustomerTransaction = require('../models/customer-transaction.model')
const CustomerUnitizedPerformance = require('../models/customer-unitized-performance.model')
const AssetAllocation = require('../models/asset-allocation.model')

const CustomerUnitizedPerformanceResource = {
    id: 'CustomerUnitizedPerformance',
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        date: {
            type: 'date',
            isVisible: { list: true, filter: true, show: true, edit: false },
        },
        lastPeriodDate: {
            type: 'date',
            isVisible: { list: false, filter: true, show: true, edit: false },
        },
        currency: {
            isVisible: { list: false, filter: true, show: true, edit: false },
        },
        currentPeriodDeposited: {
            isVisible: { list: false, filter: false, show: true, edit: false },
        },
        currentPeriodWithdrawn: {
            isVisible: { list: false, filter: false, show: true, edit: false },
        },
        currentPeriodUnitsDeposited: {
            isVisible: { list: false, filter: false, show: true, edit: false },
        },
        currentPeriodUnitsWithdrawn: {
            isVisible: { list: false, filter: false, show: true, edit: false },
        },
        lastPeriodUnit: {
            isVisible: { list: false, filter: false, show: true, edit: false },
        },
        currentPeriodUnit: {
            isVisible: { list: true, filter: false, show: true, edit: false },
        },
        currentPeriodNAVPerUnit: {
            isVisible: { list: true, filter: false, show: true, edit: false },
        },
        lastPeriodNAV: {
            isVisible: { list: false, filter: false, show: true, edit: false },
        },
        currentPeriodNAV: {
            isVisible: { list: true, filter: false, show: true, edit: false },
        },
        netChange: {
            isVisible: { list: false, filter: false, show: true, edit: false },
        },
        unitizedChange: {
            isVisible: { list: true, filter: false, show: true, edit: false },
        }
    },
    actions: {
        new: {
            isAccessible: false
        },
        delete: {
            isAccessible: false
        },
        edit: {
            isAccessible: false
        },
        bulkDelete: {
            isAccessible: false
        }, 
        list: {
            isAccessible: false
        },
        calc: {
            actionType: 'resource',
            isVisible: false,
            isAccessible: true,
            component: AdminJS.bundle('../components/Approval.jsx'),
            handler: async(request, response, context) => {
                let currentDate = request.payload.currentDate
                let lastDate = request.payload.lastDate
                if (currentDate && !lastDate) {
                    //initilization of records
                    let customerPortfolioRecords = await CustomerPortfolio.find({startDate: currentDate})
                    await Promise.all(customerPortfolioRecords.map(async (record) => {
                        let newCustomerUnitizedRecord = {}
                        newCustomerUnitizedRecord.customer = record.customer
                        newCustomerUnitizedRecord.date = currentDate
                        newCustomerUnitizedRecord.currency = record.currency
                        newCustomerUnitizedRecord.lastPeriodUnit = 0
                        newCustomerUnitizedRecord.lastPeriodNAV = 0
                        newCustomerUnitizedRecord.currentPeriodUnit = record.startUnit
                        newCustomerUnitizedRecord.netChange = 0
                        newCustomerUnitizedRecord.unitizedChange = 0
                        newCustomerUnitizedRecord.currentPeriodDeposited = 0
                        newCustomerUnitizedRecord.currentPeriodWithdrawn = 0
                        newCustomerUnitizedRecord.currentPeriodUnitsDeposited = 0
                        newCustomerUnitizedRecord.currentPeriodUnitsWithdrawn = 0
                        let total = 0
                        await Promise.all(record.accountPolicyNumber.map(async (account) => {
                            let assetAllocationRecord = await AssetAllocation.findOne({date: currentDate, isReconciled: true, accountPolicyNumber: account})
                            if (assetAllocationRecord && record.currency.toString() === assetAllocationRecord.currency.toString()) {
                                total = total + assetAllocationRecord.total
                            } 
                            else if (assetAllocationRecord && record.currency.toString() !== assetAllocationRecord.currency.toString()) {
                                total = total + assetAllocationRecord.total / 7.8
                            }
                        }))
                        newCustomerUnitizedRecord.currentPeriodNAV = Math.round(total*100,2)/100
                        newCustomerUnitizedRecord.currentPeriodNAVPerUnit = Math.round(100* total / record.startUnit,2)/100
                        const unitizedRecord = new CustomerUnitizedPerformance(newCustomerUnitizedRecord)
                        await unitizedRecord.save()
                    }))
                    return { result: { success: 'Operation complete' } }
                } else if (currentDate && lastDate) {
                    const unitizedRecords = await CustomerUnitizedPerformance.find({date: lastDate})
                    await Promise.all(unitizedRecords.map(async (record) => {
                        let newCustomerUnitizedRecord = {}
                        newCustomerUnitizedRecord.customer = record.customer
                        newCustomerUnitizedRecord.date = currentDate
                        newCustomerUnitizedRecord.currency = record.currency
                        newCustomerUnitizedRecord.lastPeriodDate = lastDate
                        newCustomerUnitizedRecord.lastPeriodUnit = record.currentPeriodUnit
                        newCustomerUnitizedRecord.lastPeriodNAV = record.currentPeriodNAV
                        let customerPortfolioRecord = await CustomerPortfolio.findOne({customer: record.customer})
                        let total = 0
                        let totalDeposit = 0
                        let totalWithdraw = 0
                        await Promise.all(customerPortfolioRecord.accountPolicyNumber.map(async (account) => {
                            let assetAllocationRecord = await AssetAllocation.findOne({date: currentDate, isReconciled: true, accountPolicyNumber: account})
                            if (assetAllocationRecord && record.currency.toString() === assetAllocationRecord.currency.toString()) {
                                total = total + assetAllocationRecord.total
                            } 
                            else if (assetAllocationRecord && record.currency.toString() !== assetAllocationRecord.currency.toString()) {
                                total = total + assetAllocationRecord.total / 7.8
                            }
                        }))   
                        let CustomerTransactionRecords = await CustomerTransaction.find({date: currentDate, isReconciled: true, customer: record.customer})
                        await Promise.all(CustomerTransactionRecords.map(async (tran) => {
                            if (record.currency.toString() === tran.currency.toString()) {
                                if (tran.nominalValue > 0) {
                                    totalDeposit = totalDeposit + tran.nominalValue
                                } else if (tran.nominalValue < 0) {
                                    totalWithdraw = totalWithdraw - tran.nominalValue
                                }
                            } else {
                                if (tran.nominalValue > 0) {
                                    totalDeposit = totalDeposit + tran.nominalValue / 7.8
                                } else if (tran.nominalValue < 0) {
                                    totalWithdraw = totalWithdraw - tran.nominalValue / 7.8
                                }
                            }
                        }))
                        newCustomerUnitizedRecord.currentPeriodDeposited = Math.round(100*totalDeposit,2)/100
                        newCustomerUnitizedRecord.currentPeriodWithdrawn = Math.round(100*totalWithdraw,2)/100
                        newCustomerUnitizedRecord.currentPeriodUnitsDeposited = Math.round(10000*newCustomerUnitizedRecord.currentPeriodDeposited / record.currentPeriodNAVPerUnit,4)/10000
                        newCustomerUnitizedRecord.currentPeriodUnitsWithdrawn = Math.round(10000*newCustomerUnitizedRecord.currentPeriodWithdrawn / record.currentPeriodNAVPerUnit,4)/10000
                        newCustomerUnitizedRecord.currentPeriodNAV = Math.round(total*100,2)/100
                        newCustomerUnitizedRecord.currentPeriodUnit = newCustomerUnitizedRecord.lastPeriodUnit - newCustomerUnitizedRecord.currentPeriodUnitsWithdrawn + newCustomerUnitizedRecord.currentPeriodUnitsDeposited
                        newCustomerUnitizedRecord.currentPeriodNAVPerUnit = Math.round(100* total / newCustomerUnitizedRecord.currentPeriodUnit,2)/100
                        newCustomerUnitizedRecord.netChange = Math.round(100*((newCustomerUnitizedRecord.currentPeriodNAV - newCustomerUnitizedRecord.lastPeriodNAV) - newCustomerUnitizedRecord.currentPeriodDeposited + newCustomerUnitizedRecord.currentPeriodWithdrawn),2)/100
                        newCustomerUnitizedRecord.unitizedChange = Math.round(1000*(100*(newCustomerUnitizedRecord.currentPeriodNAVPerUnit - record.currentPeriodNAVPerUnit) / record.currentPeriodNAVPerUnit),3)/1000
                        const unitizedRecord = new CustomerUnitizedPerformance(newCustomerUnitizedRecord)
                        await unitizedRecord.save()
                    }))
                    return { result: { success: 'Operation complete' } }
                } else {
                    return { result: { error: 'Invalid date' } }
                }
            }
        }
    }
}

module.exports = CustomerUnitizedPerformanceResource