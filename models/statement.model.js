const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StatementSchema = new Schema({
    reference: String,
    from: {
        type: Schema.Types.ObjectId,
        ref: 'CounterParty'
    },
    statementcode : {
        type: Schema.Types.ObjectId,
        ref: 'StatementParticular'
    },
    date: Date,
    period: {
        type: Schema.Types.ObjectId,
        ref: 'Period'
    },
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency'
    },
    remark: String,
    tag: String,
    grossamount: Number,
    statementitems: [{
        accountnumber: {
            type: Schema.Types.ObjectId,
            ref: 'AccountPolicy'
        },
        grossamount: Number,
        netamount: Number,
    }],
    bankStatementitem: {
        type: Schema.Types.ObjectId,
        ref: 'BankStatementItem'
    },
    status: {
        type: String,
        enum: ['Init','DetailsMatched','BankFeesAllocated','FeeSharingCompleted'],
        default: 'Init'
    },
    bankcharges: Number,
    netamount: Number,
    isLocked: {
        type: Boolean,
        default: false
    }
})

const Statement = mongoose.model('Statement', StatementSchema, 'Statements')

module.exports = Statement