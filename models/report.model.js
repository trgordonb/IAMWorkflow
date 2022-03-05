const mongoose = require('mongoose')
const Currency = require('./currency.model')
const AccountLedgerBalance = require('./account-ledger-balance.model')
const Schema = mongoose.Schema

const ReportSchema = new Schema({
    name: String,
    source: {
        type: String,
        enum : ['AccountLedgerBalances','EstablishmentFeeShares'],
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
        enum: ['Management Fees', 'Retrocession','All']
    },
    lockRecords: {
        type: Boolean,
        default: false
    }
})

ReportSchema.post('findOneAndUpdate', async function() {
    let preFilterStages = this._update.$set.filters.map(filter => ([filter.fieldname, filter.value]))
    const filters = Object.fromEntries(new Map(preFilterStages))
    const transform = this._update.$set.lockRecords ? { isLocked: true } : { isLocked: false }
    if (this._update.$set.source === 'AccountLedgerBalances') {
        AccountLedgerBalance.updateMany(filters, transform, (err, docs) => {
            if (err) {
                console.log(err)
            } else {
                console.log(docs)
            }
        })
    }
})

const Report = mongoose.model('Report', ReportSchema, 'Reports')

module.exports = Report