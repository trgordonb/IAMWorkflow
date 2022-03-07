const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Currency = require('./currency.model')

const TaskSchema = new Schema({
    name: String,
    source: {
        name: {
            type: String,
            enum : ['AccountLedgerBalance','EstablishmentFeeShare','DemandNote'],
        },
        field: {
            type: String
        }
    },
    target: {
        name: {
            type: String,
            enum : ['AccountLedgerBalance','EstablishmentFeeShare','DemandNote'],
        },
        field: {
            type: String
        }
    },
    relationship: {
        type: String,
        enum: ['OneOnOne','ManyOnOne','OneOnMany']
    },
    matcheOn: {
        type: String,
        enum: ['accountnumber']
    },
    tag: String,
    lastRunTime: Date,
    lastRunStatus: {
        type: String,
        enum: ['Matched', 'Unmatched']
    },
    lastRunDetails: [{
        status:{
            type: String,
            enum: ['Matched','Unmatched']
        },
        source: {
            name: String,
            id: String
        },
        target: {
            name: String,
            id: String
        }
    }]
})

TaskSchema.post('findOneAndUpdate', async function() {
    let runDetails = this._update.$set.lastRunDetails
    await Promise.all(runDetails.map(async (doc) => {
        let sourceModel = Currency.db.models[doc.source.name]
        let sourceRecord = await sourceModel.findById(doc.source.id)
        sourceRecord.reconcileStatus = [{
            with: doc.target.name,
            lastReconcileTime: new Date(),
            lastReconcileStatus: doc.status,
            link:  doc.target.id !== '' ? new mongoose.Types.ObjectId(doc.target.id): undefined
        }]
        await sourceRecord.save()
        let targetModel = Currency.db.models[doc.target.name]
        if (doc.target.id !== '') {
            let targetRecord = await targetModel.findById(doc.target.id)
            targetRecord.reconcileStatus = [{
                with: doc.source.name,
                lastReconcileTime: new Date(),
                lastReconcileStatus: doc.status,
                link: new mongoose.Types.ObjectId(doc.source.id)
            }]
            await targetRecord.save()
        }
    }))
})

const Task = mongoose.model('Task', TaskSchema, 'Tasks')

module.exports = Task