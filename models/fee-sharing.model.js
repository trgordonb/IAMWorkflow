const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FeeSharingSchemeSchema = new Schema({
    code: String,
    introducer: {
        type: Schema.Types.ObjectId,
        ref: 'Payee'
    },
    introducerRebate: Number,
    marketingManager: {
        type: Schema.Types.ObjectId,
        ref: 'Payee',
    },
    marketingManagerRebate: Number,
    relationshipManager: {
        type: Schema.Types.ObjectId,
        ref: 'Payee',
    },
    relationshipManagerRebate: Number,
    teamLeader: {
        type: Schema.Types.ObjectId,
        ref: 'Payee'
    },
    teamLeaderRebate: Number,
    assistant: {
        type: Schema.Types.ObjectId,
        ref: 'Payee'
    },
    assistantRebate: Number,
    teamAdviser : {
        type: Schema.Types.ObjectId,
        ref: 'Payee'
    },
    teamAdviserRebate: Number,
    companyWealth : {
        type: Schema.Types.ObjectId,
        ref: 'Payee'
    },
    companyWealthRebate: Number
})

const FeeSharingScheme = mongoose.model('FeeSharingScheme', FeeSharingSchemeSchema, 'FeeSharingSchemes')

module.exports = FeeSharingScheme