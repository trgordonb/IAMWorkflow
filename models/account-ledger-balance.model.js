const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PolicyFeeSetting = require('./policyfee-setting.model')
const AccountPolicy = require('./account-policy')
const User = require('./user.model')

const AccountLedgerBalanceSchema = new Schema({
    accountnumber: {
        type: Schema.Types.ObjectId,
        ref: 'AccountPolicy'
    },
    NAVDate: Date,
    tag: String,
    AUM: Number,
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency',
    },
    estimatedfee: Number,
    overrideAdvisorFee: Boolean,
    advisorfee: Number,
    retrocession: Number,
    lastModifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    lastModifiedTime: Date,
    isLocked: {
        type: Boolean,
        default: false
    }
})

AccountLedgerBalanceSchema.pre('save', async function() {
    if (!this.overrideAdvisorFee) {
        const policyfee = await PolicyFeeSetting.findOne({accountnumber : this.accountnumber}).populate('advisorfee')
        const accountPolicy = await AccountPolicy.findOne({accountnumber: this.accountnumber})
        if (policyfee && policyfee.advisorfee && policyfee.advisorfee.value) {
            const percentage = policyfee.advisorfee.value / 100
            this.advisorfee = (percentage * this.AUM).toFixed(2)
        }
        if (accountPolicy) {
            this.currency = accountPolicy.currency
        }
        this.lastModifiedTime = new Date()
    }
})

AccountLedgerBalanceSchema.pre('findOneAndUpdate', async function() {
    if (!this._update.$set.overrideAdvisorFee) {
        const policyfee = await PolicyFeeSetting.findOne({accountnumber : this._update.$set.accountnumber}).populate('advisorfee')
        const accountPolicy = await AccountPolicy.findOne({accountnumber: this._update.$set.accountnumber})
        if (policyfee && policyfee.advisorfee && policyfee.advisorfee.value) {
            const percentage = policyfee.advisorfee.value / 100
            this._update.$set.advisorfee = (percentage * this._update.$set.AUM).toFixed(2)
        }
        if (accountPolicy) {
            this._update.$set.currency = accountPolicy.currency
        }
        this._update.$set.lastModifiedTime = new Date()
    }
})

const AccountLedgerBalance = mongoose.model('AccountLedgerBalance', AccountLedgerBalanceSchema, 'AccountLedgerBalances')

module.exports = AccountLedgerBalance