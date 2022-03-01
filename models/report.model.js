const mongoose = require('mongoose')
const Currency = require('./currency.model')
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
    }
})

ReportSchema.post('save', async function() {
    let filterStages = this.filters.map(filter => (
        {
            "$match" : { [filter.fieldname] : filter.value }
        }
    ))
    let lookupStage = {
        '$lookup': {
            from: 'AccountCustodians', 
            localField: 'accountnumber', 
            foreignField: 'accountPolicyNumber', 
            as: 'custodian'
        }
    }
    let transformStage = {
        '$set': {
            custodian: {
                '$arrayElemAt': ['$custodian.custodian', 0]
            }
        }
    }
    Currency.db.createCollection(this.name, {
        viewOn: this.source,
        pipeline: [...filterStages, lookupStage, transformStage]
    })
})

const Report = mongoose.model('Report', ReportSchema, 'Reports')

module.exports = Report