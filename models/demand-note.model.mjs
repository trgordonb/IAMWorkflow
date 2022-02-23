import mongoose from 'mongoose'
const Schema = mongoose.Schema
import FeeSharing from './fee-sharing.model.mjs'
import CurrenyHistory from './currency-history.model.mjs'
import EstablishmentFeeShare from './establishment-feeshare.model.mjs'

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

DemandNoteSchema.post('save', async function() {
    const feeSharingRaw = await FeeSharing.findById(this.feesharing).populate('feerecipients')
    const exchRateRaw = await CurrenyHistory.findOne({currency: this.currency, date: this.serviceFeeEndDate})
    const feeSharingCalculated = [] 
    feeSharingRaw.feerecipients.forEach(item => {
        const amount = (this.amount * ( item.percentage / 100 ) * exchRateRaw.rate).toFixed(2)
        feeSharingCalculated.push({
            recipient: item.recipient,
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
        receivedDate: this.receivedDate,
        currency: this.currency,
        recipientRecords: feeSharingCalculated
    })
    await establishmentFeeShare.save()
})

DemandNoteSchema.pre('findOneAndUpdate', async function() {
    const feeSharingRaw = await FeeSharing.findById(this._update.$set.feesharing).populate('feerecipients')
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
        receivedDate: this._update.$set.receivedDate,
        currency: this._update.$set.currency,
        recipientRecords: feeSharingCalculated
    })
})

const DemandNote = mongoose.model('DemandNote', DemandNoteSchema, 'DemandNotes')

export default DemandNote