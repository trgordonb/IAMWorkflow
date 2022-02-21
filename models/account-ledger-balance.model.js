const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PolicyFeeSetting = require('./policyfee-setting.model')

const AccountLedgerBalanceSchema = new Schema({
    accountnumber: {
        type: Schema.Types.ObjectId,
        ref: 'AccountPolicy'
    },
    NAVDate: Date,
    AUM: Number,
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency',
    },
    estimatedfee: Number,
    overrideAdvisorFee: Boolean,
    advisorfee: Number,
    retrocession: Number
})

AccountLedgerBalanceSchema.pre('save', async function() {
    if (!this.overrideAdvisorFee) {
        const policyfee = await PolicyFeeSetting.findOne({accountnumber : this.accountnumber}).populate('advisorfee')
        if (policyfee && policyfee.advisorfee && policyfee.advisorfee.value) {
            const percentage = policyfee.advisorfee.value / 100
            this.advisorfee = Math.round(percentage * this.AUM,2)
        }
    }
})

AccountLedgerBalanceSchema.pre('findOneAndUpdate', async function() {
    if (!this._update.$set.overrideAdvisorFee) {
        const policyfee = await PolicyFeeSetting.findOne({accountnumber : this._update.$set.accountnumber}).populate('advisorfee')
        if (policyfee && policyfee.advisorfee && policyfee.advisorfee.value) {
            const percentage = policyfee.advisorfee.value / 100
            this._update.$set.advisorfee = Math.round(percentage * this._update.$set.AUM)
        }
    }
})

const AccountLedgerBalance = mongoose.model('AccountLedgerBalance', AccountLedgerBalanceSchema, 'AccountLedgerBalances')

module.exports = AccountLedgerBalance