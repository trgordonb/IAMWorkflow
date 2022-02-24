import mongoose from 'mongoose'
const Schema = mongoose.Schema

const EstablishmentFeeShareSchema = new Schema({
    demandnote : {
        type: Schema.Types.ObjectId,
        ref: 'DemandNote'
    },
    accountnumber: {
        type: Schema.Types.ObjectId,
        ref: 'AccountPolicy'
    },
    totalAmount: Number,
    date: Date,
    providerStatement: String,
    particulars: String,
    receivedDate: Date,
    tag: String,
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency',
    },
    recipientRecords: [{
        recipient: {
            type: Schema.Types.ObjectId,
            ref: 'Payee'
        },
        share: Number,
        amount: Number,
        role: {
            type: Schema.Types.ObjectId,
            ref: 'Role'
        }
    }]
})

const EstablishmentFeeShare = mongoose.model('EstablishmentFeeShare', EstablishmentFeeShareSchema, 'EstablishmentFeeShares')

export default EstablishmentFeeShare
