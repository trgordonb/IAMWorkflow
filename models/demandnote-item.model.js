const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DemandNoteItemSchema = new Schema({
    period: {
        type: Schema.Types.ObjectId,
        ref: 'Period',
        index: true
    },
    custodian: {
        type: Schema.Types.ObjectId,
        ref: 'Custodian',
        index: true
    },
    custodianAccount: {
        type: Schema.Types.ObjectId,
        ref: 'AccountPolicy',
        index: true
    },
    accountNAV: {
        type: Number,
        index: true
    },
    factor: {
        type: Number,
        index: true
    },
})

const DemandNoteItem = mongoose.model('DemandNoteItem', DemandNoteItemSchema, 'DemandNoteItems')

module.exports = DemandNoteItem