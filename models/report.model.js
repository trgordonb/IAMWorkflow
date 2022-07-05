const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReportSchema = new Schema({
    name: {
        type: String,
        index: true
    }
})

const Report = mongoose.model('Report', ReportSchema, 'Reports')

module.exports = Report