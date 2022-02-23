import mongoose from 'mongoose'
const Schema = mongoose.Schema

const FeeSharingSchemeSchema = new Schema({
    code: String,
    feerecipients: [{
        recipient: {
            type: Schema.Types.ObjectId,
            ref: 'Payee'
        },
        percentage: Number,
        role: {
            type: Schema.Types.ObjectId,
            ref: 'Role'
        }
    }]
})

const FeeSharingScheme = mongoose.model('FeeSharingScheme', FeeSharingSchemeSchema, 'FeeSharingSchemes')

export default FeeSharingScheme