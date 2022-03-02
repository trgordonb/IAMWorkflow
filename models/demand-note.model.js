const mongoose = require('mongoose')
const Schema = mongoose.Schema
const FeeSharing = require('./fee-sharing.model')
const Currency = require('./currency.model')
const CurrenyHistory = require('./currency-history.model')
const AccountPolicy = require('./account-policy')
const EstablishmentFeeShare = require('./establishment-feeshare.model')

const DemandNoteSchema = new Schema({
    accountnumber: {
        type: Schema.Types.ObjectId,
        ref: 'AccountPolicy'
    },
    date: Date,
    providerStatement: String,
    statementCode : {
        type: Schema.Types.ObjectId,
        ref: 'StatementParticular'
    },
    comment: String,
    serviceFeeStartDate: Date,
    serviceFeeEndDate: Date,
    receivedDate: Date,
    tag: String,
    receivedPayee: {
        type: Schema.Types.ObjectId,
        ref: 'Payee'
    },
    amount: Number,
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency'
    },
    feesharing: {
        type: Schema.Types.ObjectId,
        ref: 'FeeSharingScheme'
    }
})

DemandNoteSchema.pre('save', async function() {
    const accountPolicy = await AccountPolicy.findOne({accountnumber: this.accountnumber})
    if (accountPolicy) {
        this.currency = accountPolicy.currency
    }
})

DemandNoteSchema.post('save', async function() {
    const feeSharingRaw = await FeeSharing.findById(this.feesharing).populate('feerecipients')
    const currenycRaw = await Currency.findOne({name: 'HKD'})
    const exchRateRaw = await CurrenyHistory.findOne({currency: this.currency, date: this.serviceFeeEndDate})
    const feeSharingCalculated = [] 
    feeSharingRaw.feerecipients.forEach(item => {
        const amount = (this.amount * ( item.percentage / 100 ) * exchRateRaw.rate).toFixed(2)
        feeSharingCalculated.push({
            recipient: item.recipient,
            share: item.percentage,
            role: item.role,
            amount: amount
        })
    })
    const establishmentFeeShare = new EstablishmentFeeShare({
        demandnote: this._id,
        accountnumber: this.accountnumber,
        date: this.date,
        providerStatement: this.providerStatement,
        particulars: this.comment,
        tag: this.tag,
        receivedDate: this.receivedDate,
        currency: currenycRaw._id,
        totalAmount: (this.amount * exchRateRaw.rate).toFixed(2),
        recipientRecords: feeSharingCalculated
    })
    await establishmentFeeShare.save()
})

DemandNoteSchema.pre('findOneAndUpdate', async function() {
    const feeSharingRaw = await FeeSharing.findById(this._update.$set.feesharing).populate('feerecipients')
    const accountPolicy = await AccountPolicy.findOne({accountnumber: this._update.$set.accountnumber})
    if (accountPolicy) {
        this._update.$set.currency = accountPolicy.currency
    }
    const currenycRaw = await Currency.findOne({name: 'HKD'})
    const exchRateRaw = await CurrenyHistory.findOne({currency: this._update.$set.currency, date: this._update.$set.serviceFeeEndDate})
    const feeSharingCalculated = [] 
    feeSharingRaw.feerecipients.forEach(item => {
        const amount = (this._update.$set.amount * ( item.percentage / 100 ) * exchRateRaw.rate).toFixed(2)
        feeSharingCalculated.push({
            recipient: item.recipient,
            role: item.role,
            amount: amount
        })
    })
    await EstablishmentFeeShare.findOneAndUpdate({demandnote: this._update.$set._id}, {
        accountnumber: this._update.$set.accountnumber,
        date: this._update.$set.date,
        providerStatement: this._update.$set.providerStatement,
        particulars: this._update.$set.comment,
        tag: this._update.$set.tag,
        receivedDate: this._update.$set.receivedDate,
        totalAmount: (this._update.$set.amount * exchRateRaw.rate).toFixed(2),
        currency: currenycRaw._id,
        recipientRecords: feeSharingCalculated
    })
})

const DemandNote = mongoose.model('DemandNote', DemandNoteSchema, 'DemandNotes')

module.exports = DemandNote