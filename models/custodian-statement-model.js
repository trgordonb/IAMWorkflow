const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CustodianStatementSchema = new Schema({
    custodianAccount: {
        type: Schema.Types.ObjectId,
        ref: 'AccountPolicy',
        index: true
    },
    statementDate: {
        type: Date,
        index: true
    },
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency',
        index: true
    },
    cashValue: {
        type: Number,
        default: 0,
        index: true
    },
    equitiesValue: {
        type: Number,
        default: 0,
        index: true
    },
    derivativesValue: {
        type: Number,
        default: 0,
        index: true
    },
    bondsValue: {
        type: Number,
        default: 0,
        index: true
    },
    alternativesValue: {
        type: Number,
        default: 0,
        index: true
    },
    status: {
        type: String,
        enum: ['approved','pending','rejected'],
        default: 'pending',
        index: true,
    },
    alert: {
        type: Boolean,
        default: false,
        index: true
    },
    recordEnteredBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    period: {
        type: Schema.Types.ObjectId,
        ref: 'Period'
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})

CustodianStatementSchema.virtual('total').get(function() {
    let total = this.cashValue + this.equitiesValue + this.derivativesValue + this.bondsValue + this.alternativesValue
    return total
})

CustodianStatementSchema.virtual('cashAllocation').get(function() {
    let total = this.cashValue + this.equitiesValue + this.derivativesValue + this.bondsValue + this.alternativesValue
    return (100* (this.cashValue / total)).toFixed(2)
})

CustodianStatementSchema.virtual('equitiesAllocation').get(function() {
    let total = this.cashValue + this.equitiesValue + this.derivativesValue + this.bondsValue + this.alternativesValue
    return (100 * (this.equitiesValue / total)).toFixed(2)
})

CustodianStatementSchema.virtual('derivativesAllocation').get(function() {
    let total = this.cashValue + this.equitiesValue + this.derivativesValue + this.bondsValue + this.alternativesValue
    return (100 * (this.derivativesValue / total)).toFixed(2)
})

CustodianStatementSchema.virtual('bondsAllocation').get(function() {
    let total = this.cashValue + this.equitiesValue + this.derivativesValue + this.bondsValue + this.alternativesValue
    return (100 * (this.bondsValue / total)).toFixed(2)
})

CustodianStatementSchema.virtual('alternativesAllocation').get(function() {
    let total = this.cashValue + this.equitiesValue + this.derivativesValue + this.bondsValue + this.alternativesValue
    return (100 * (this.alternativesValue / total)).toFixed(2)
})

/**CustodianStatementSchema.pre('save', async function() {
    this.total = this.cashValue + this.derivativesValue + this.bondsValue + this.equitesValue + this.alternativesValue
})

CustodianStatementSchema.pre('findOneAndUpdate', async function() {
    let sum = 0
    this._update.$set.assets.forEach(asset => {
        sum = sum + parseFloat(asset.assetValue)
    })
    this._update.$set.total = sum
    this._update.$set.assets.forEach(asset => {
        asset.assetAllocation = Math.round(100 * (asset.assetValue / sum), 2)
    })
})*/

const CustodianStatement = mongoose.model('CustodianStatement', CustodianStatementSchema, 'CustodianStatements')

module.exports = CustodianStatement