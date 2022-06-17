const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')

const PeriodSchema = new Schema({
    name: {
        type: String,
        index: true
    },
    start: {
        type: Date,
        index: true
    },
    end: {
        type: Date,
        index: true
    },
    subPeriodEndDates: [Date],
    factor: Number,
    exchangeRates: [{
        currencyPair: {
            type: Schema.Types.ObjectId,
            ref: 'CurrencyPair'
        },
        value: {
            type: Number,
        }
    }]
})

PeriodSchema.pre('save', function() {
    let isLeapYear = moment(this.end).isLeapYear()
    let dayDiff = moment.duration(moment(this.end).diff(moment(this.start))).asDays() + 1
    console.log(dayDiff)
    this.factor = isLeapYear ? dayDiff / 366 : dayDiff / 365
})

PeriodSchema.pre('findOneAndUpdate', function() {
    let isLeapYear = moment(this._update.$set.end).isLeapYear()
    let dayDiff = moment.duration(moment(this._update.$set.end).diff(moment(this._update.$set.start))).asDays() + 1
    this._update.$set.factor = isLeapYear ? dayDiff / 366 : dayDiff / 365
})

const Period = mongoose.model('Period', PeriodSchema, 'Periods')

module.exports = Period