import mongoose from 'mongoose'
const Schema = mongoose.Schema

const AccountCustodianSchema = new Schema({
    accountPolicyNumber: {
        type: Schema.Types.ObjectId,
        ref: 'AccountPolicy'
    },
    custodian: {
        type: Schema.Types.ObjectId,
        ref: 'Custodian'
    }
})

const AccountCustodian = mongoose.model('AccountCustodian', AccountCustodianSchema, 'AccountCustodians')

export default AccountCustodian