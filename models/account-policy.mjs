import mongoose from 'mongoose'
const Schema = mongoose.Schema

const AccountPolicySchema = new Schema({
    number: String
})

const AccountPolicy = mongoose.model('AccountPolicy', AccountPolicySchema, 'AccountPolicies' )

export default AccountPolicy