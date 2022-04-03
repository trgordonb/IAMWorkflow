const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustomerUnitizedPerformanceSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    date: Date,
    lastPeriodDate: Date,
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency'
    },
    currentPeriodDeposited: Number,
    currentPeriodWithdrawn: Number,
    currentPeriodUnitsDeposited: Number,
    currentPeriodUnitsWithdrawn: Number,
    lastPeriodUnit: Number,
    currentPeriodUnit: Number,
    lastPeriodNAV: Number,
    currentPeriodNAV: Number,
    currentPeriodNAVPerUnit: Number,
    netChange: Number,
    unitizedChange: Number
})

const CustomerUnitizedPerformance = mongoose.model('CustomerUnitizedPerformance', CustomerUnitizedPerformanceSchema, 'CustomerUnitizedPerformances')

module.exports = CustomerUnitizedPerformance