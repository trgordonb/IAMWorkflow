const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
    }
})

const DemandNote = mongoose.model('DemandNote', DemandNoteSchema, 'DemandNotes')

module.exports = DemandNote