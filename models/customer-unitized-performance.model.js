const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustomerUnitizedPerformanceSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        index: true
    },
    period: {
        type: Schema.Types.ObjectId,
        ref: 'Period',
        index: true
    },
    lastSubPeriodDate: {
        type: Date,
        index: true
    },
    lastSubPeriodUnit: {
        type: Number,
        index: true
    },
    lastSubPeriodNAV: {
        type: Number,
        index: true
    },
    currentSubPeriodDate: {
        type: Date,
        index: true
    },
    currentSubPeriodUnit: {
        type: Number,
        index: true
    },
    currentSubPeriodNAV: {
        type: Number,
        index: true
    },
    currentSubPeriodNAVPerUnit: {
        type: Number,
        index: true
    },
    currentSubPeriodDeposited: Number,
    currentSubPeriodWithdrawn: Number,
    currentSubPeriodUnitsDeposited: Number,
    currentSubPeriodUnitsWithdrawn: Number,
    netChange: {
        type: Number,
        index: true
    },
    unitizedChange: {
        type: Number,
        index: true
    },
    status: {
        type: String,
        index: true,
        enum: ['pending','approved']
    },
    alert: {
        type: Boolean,
        index: true,
        default: false
    }
})

const CustomerUnitizedPerformance = mongoose.model('CustomerUnitizedPerformance', CustomerUnitizedPerformanceSchema, 'CustomerUnitizedPerformances')

module.exports = CustomerUnitizedPerformance