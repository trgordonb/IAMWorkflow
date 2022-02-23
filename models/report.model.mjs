import mongoose from 'mongoose'
import Currency from './currency.model.mjs'
const Schema = mongoose.Schema

const ReportSchema = new Schema({
    name: String,
    source: {
        type: String,
        enum : ['AccountLedgerBalances',],
    },
    filters: [{
        fieldname: {
            type: String,
            enum: ['tag']
        },
        value: String
    }],
    display: {
        type: String,
        enum: ['Management Fees', 'Retrocession']
    }
})

ReportSchema.post('save', async function() {
    Currency.db.createCollection(this.name, {
        viewOn: this.source,
        pipeline: this.filters.map(filter => (
            {
                "$match" : {
                    [filter.fieldname] : filter.value
                }
            }
        ))
    })
})

const Report = mongoose.model('Report', ReportSchema, 'Reports')

export default Report