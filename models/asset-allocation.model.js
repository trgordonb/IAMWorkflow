const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AssetAllocationSchema = new Schema({
    accountPolicyNumber: {
        type: Schema.Types.ObjectId,
        ref: 'AccountPolicy'
    },
    date: Date,
    currency: {
        type: Schema.Types.ObjectId,
        ref: 'Currency'
    },
    cash: {
        type: Number,
        default: 0
    },
    forwards: {
        type: Number,
        default: 0
    },
    bonds: {
        type: Number,
        default: 0
    },
    equities: {
        type: Number,
        default: 0
    },
    alternate: {
        type: Number,
        default: 0
    },
    total: Number,
    totalPercentChange: {
        type: Number,
        default: 0
    },
    totalValueAlert: {
        type: Boolean,
        default: false
    },
    isReconciled: {
        type: Boolean,
        default: false
    },
    recordEnteredBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

AssetAllocationSchema.pre('save', function() {
    this.total = Math.round(100 * (this.cash + this.bonds + this.forwards + this.equities + this.alternate),2)/100
})

AssetAllocationSchema.pre('findOneAndUpdate', function() {
    this._update.$set.total = Math.round(100*(this._update.$set.cash + this._update.$set.equities + this._update.$set.forwards + this._update.$set.bonds + this._update.$set.alternate),2)/100
})

const AssetAllocation = mongoose.model('AssetAllocation', AssetAllocationSchema, 'AssetAllocations')

module.exports = AssetAllocation