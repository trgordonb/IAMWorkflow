const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { StatementItemSchema, StatementItem } = require('./statement-item.model')

const StatementSummarySchema = new Schema({
    name: {
        type: String,
        index: true
    },
    sum: {
        type: Number,
        index: true
    },
    custodian: {
        type: Schema.Types.ObjectId,
        ref: 'Custodian',
        index: true
    },
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency',
        index: true
    },
    type: {
        type: String,
        index: true,
        enum: ['ManagementFee','RetrocessionFee']
    },
    period: {
        type: Schema.Types.ObjectId,
        ref: 'Period',
        index: true
    },
    details: [StatementItemSchema],
    status: {
        type: String,
        index: true,
        enum: ['approved','pending']
    },
    matched: {
        type: Boolean,
        index: true,
        default: false
    }
})

StatementSummarySchema.pre('save', async function() {
    if (this.type !== 'ManagementFee') {
        await Promise.all(this.details.map(async (detail) => {
            let statementItem = new StatementItem(detail)
            await statementItem.save()
        }))
    }
})

StatementSummarySchema.post('findOneAndRemove', async function(doc) {
    Promise.all(doc.details.map(async (detail) => {
        await StatementItem.findByIdAndDelete(detail._id.toString())
    }))
})



const StatementSummary = mongoose.model('StatementSummary', StatementSummarySchema, 'StatementSummaries')

module.exports = StatementSummary