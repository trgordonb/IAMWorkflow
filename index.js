const AdminJSExpress = require('@adminjs/express')
const AdminJS = require('adminjs')
const express = require('express')
const adminJsStatic = require('./adminJsBuilder')
const AdminJsMongoose = require('@adminjs/mongoose')
const mongoose = require('mongoose')
const ReportModel = require('./models/report.model')

AdminJS.registerAdapter(AdminJsMongoose)

const ADMIN = {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'lovejs',
}
const MONGO_URL = process.env.MONGO_URL

const EstablishmentFeeShareSchema = new mongoose.Schema({
    demandnote : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DemandNote'
    },
    accountnumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AccountPolicy'
    },
    custodian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Custodian'
    },
    totalAmount: Number,
    date: Date,
    providerStatement: String,
    particulars: String,
    receivedDate: Date,
    tag: String,
    currency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Currency',
    },
    recipientRecords: [{
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payee'
        },
        share: Number,
        amount: Number,
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        }
    }]
})

const ManagementFeesSchema = new mongoose.Schema({
    accountnumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AccountPolicy'
    },
    custodian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Custodian'
    },
    NAVDate: Date,
    tag: String,
    AUM: Number,
    currency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Currency',
    },
    advisorfee: Number,
})

const RetrocessionFeeSchema = new mongoose.Schema({
    accountnumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AccountPolicy'
    },
    custodian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Custodian'
    },
    NAVDate: Date,
    tag: String,
    AUM: Number,
    currency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Currency',
    },
    retrocession: Number,
})
  
async function main() {
    const app = express()
    await mongoose.connect(MONGO_URL, { useNewUrlParser: true })
    const reports = await ReportModel.find({})
    const reportTranslations = reports.map(report => (
        {
            [report.name] : {
                properties: {
                    accountnumber: 'Account Number / Policy Number',
                    advisorfee: 'Mgt/Advisory Fee p.a',
                }
            }
        }
    ))
    
    const reportResources = reports.map(report => (
        {
            resource: mongoose.model(
                report.name, 
                report.display === 'Management Fees' ? ManagementFeesSchema : report.display === 'Retrocession' ? RetrocessionFeeSchema: EstablishmentFeeShareSchema, 
                report.name),
            options: {
                parent: adminJsStatic.menu.Reports,
                actions: {
                    edit: {
                        isVisible: false
                    },
                    delete: {
                        isVisible: false
                    },
                    new: {
                        isVisible: false
                    },
                    bulkDelete: {
                        isVisible: false
                    }
                },
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    tag: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    custodian: {
                        isVisible: { list: true, filter: true, show: true, edit: false },
                    },
                    demandnote: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    date: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    receivedDate: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    NAVDate: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    }
                }
            }
        }
    ))
    const adminJsDynamic = {
        ...adminJsStatic.adminJsStatic,
        resources: [...reportResources, ...adminJsStatic.adminJsStatic.resources],
    }
    const adminJs = new AdminJS(adminJsDynamic)
    const router = AdminJSExpress.buildRouter(adminJs)
    app.use(adminJs.options.rootPath, router)
    await app.listen(process.env.PORT, () => { console.log('AdminJS is at localhost:8080/admin') })
}
  
main();