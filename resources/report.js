const AdminJS = require('adminjs')
const AccountLedgerBalance = require('../models/account-ledger-balance.model')
const FeeSharingHistory = require('../models/feeshare-history.model')
const AccountPolicy = require('../models/account-policy')
const Customer = require('../models/customer-model')
const Currency = require('../models/currency.model')
const Custodian = require('../models/custodian.model')
const Statement = require('../models/statement.model')
const Role = require('../models/role.model')
const Payee = require('../models/payee-model')
const moment = require('moment')
const { customRound } = require('../lib/utils')
const { jsPDF } = require('jspdf/dist/jspdf.node')
const { parse } = require('json2csv')

const ReportResosurce = {
    actions: {
        list: {
            isAccessible: false
        },
        export: {
            actionType: 'record',
            icon: 'Report',
            component: AdminJS.bundle('../components/MiniExport.jsx'),
            handler: async (request, response, context) => {
                const { record, resource, currentAdmin } = context
                let exportModel = record.params.source === 'AccountLedgerBalances' ? AccountLedgerBalance : FeeSharingHistory
                let parsed = null
                let transformedRecords = []
                let pdfData = null
                let pdfDoc = null
                let accumulateTotal = 0
                let feeShareTotals = {}
                let reportTypes = []
                let docs = await exportModel.find({[record.params['filters.0.fieldname']]: record.params['filters.0.value']})
                await Promise.all(docs.map(async (doc) => {
                    if (record.params.source === 'AccountLedgerBalances') {
                        reportTypes = ['csv','pdf']
                        let resultAccountPolicy = await AccountPolicy.findById(doc.accountnumber)
                        let resultCurrency = await Currency.findById(doc.currency)
                        let resultCustodian = await Custodian.findById(doc.custodian)
                        let resultCustomer = await Customer.findById(doc.customer)
                        let transformedRecord = {
                            accountnumber: resultAccountPolicy? resultAccountPolicy.number: '',
                            NAVDate: doc.NAVDate? moment(doc.NAVDate).format('YYYY-MM-DD'): '',
                            AUM: doc.AUM? doc.AUM: '',
                            currency: resultCurrency? resultCurrency.name : '',
                            advisorfee: doc.advisorfee? doc.advisorfee: '',
                            retrocession: doc.retrocession? doc.retrocession: '',
                            custodian: resultCustodian? resultCustodian.name : '',
                            customer: resultCustomer? resultCustomer.clientId: ''
                        }
                        transformedRecords.push(transformedRecord)
                    } else if (record.params.source === 'FeeShareHistory') {
                        reportTypes = ['pdf']
                        let resultAccountPolicy = await AccountPolicy.findById(doc.accountnumber)
                        let resultCurrency = await Currency.findById(doc.currency)
                        let resultStatement = await Statement.findById(doc.statement)
                        let recipients = []
                        await Promise.all(doc.recipientRecords.map(async (recipient) => {
                            let resultRole = await Role.findById(recipient.role)
                            let resultRecipient = await Payee.findById(recipient.recipient)
                            feeShareTotals[resultRecipient.name] = feeShareTotals.hasOwnProperty(resultRecipient.name) ? feeShareTotals[resultRecipient.name] + recipient.amount : recipient.amount
                            recipients.push([resultRecipient.name, resultRole.name, customRound(recipient.share), customRound(recipient.amount),'HKD'])
                        }))
                        accumulateTotal = accumulateTotal + doc.amount
                        let transformedRecord = {
                            accountnumber: resultAccountPolicy? resultAccountPolicy.number: '',
                            statement: resultStatement.reference,
                            recordDate: moment(doc.date).format('YYYY-MM-DD'),
                            totalAmount: doc.amount,
                            currency: resultCurrency? resultCurrency.name : '',
                            recipientRecords: recipients
                        }
                        transformedRecords.push(transformedRecord)
                        const { applyPlugin } = require('../lib/jspdf.plugin.autotable')
                        applyPlugin(jsPDF)
                        pdfDoc = new jsPDF()
                        pdfDoc.text('Fees Report', 14, 20)
                        transformedRecords.forEach(record => {
                            pdfDoc.autoTable({
                                styles: {
                                    fontSize: 10
                                },
                                startY: pdfDoc.lastAutoTable.finalY + 10 || 30,
                                head: [['Policy#','Statement','Date','Amount','Currency']],
                                columnStyles: {
                                    3: { halign: 'left' }
                                },
                                body: [[record.accountnumber, record.statement, moment(record.recordDate).format('YYYY-MM-DD'), customRound(record.totalAmount), record.currency]]
                            })
                            pdfDoc.autoTable({
                                styles: {
                                    fontSize: 8
                                },
                                headStyles: {
                                    fillColor: '#E4A2C6'
                                },
                                startY: pdfDoc.lastAutoTable.finalY + 10,
                                head: [['Name','Role','Share(%)','Amount','Currency']],
                                columnStyles: {
                                    3: { halign: 'left' }
                                },
                                body: record.recipientRecords
                            })
                        })
                    }                            
                }))
                if (reportTypes.includes('csv')) {
                    parsed = parse(transformedRecords)          
                } 
                if (reportTypes.includes('pdf') && record.params.source === 'AccountLedgerBalances') {
                    const { applyPlugin } = require('../lib/jspdf.plugin.autotable')
                    applyPlugin(jsPDF)
                    pdfDoc = new jsPDF()
                    pdfDoc.text('Advisor Fees Report', 14, 20)
                    pdfDoc.autoTable({
                        startY: 35,
                        head: [['Policy Number', 'Advisor Fees Amount']],
                        body: transformedRecords.map(rec => [rec.accountnumber, customRound(rec.advisorfee)])
                    })
                    pdfDoc.text('Retrocession Fees Report', 14, pdfDoc.lastAutoTable.finalY + 15)
                    pdfDoc.autoTable({
                        startY: pdfDoc.lastAutoTable.finalY + 30,
                        head: [['Policy Number', 'Retrocession Amount']],
                        body: transformedRecords.filter(item => {return item.retrocession && item.retrocession > 0}).map(rec => [rec.accountnumber, customRound(rec.retrocession)])
                    })
                    pdfData = pdfDoc.output()
                }
                if (reportTypes.includes('pdf') && record.params.source === 'FeeShareHistory') {
                    let feeShareList = []
                    for (key in feeShareTotals) {
                        feeShareList.push([key, customRound(feeShareTotals[key])])
                    }
                    pdfDoc.text('Summary', 14, pdfDoc.lastAutoTable.finalY + 15)
                    pdfDoc.autoTable({
                        startY: pdfDoc.lastAutoTable.finalY + 25,
                        styles: {
                            fontSize: 10
                        },
                        headStyles: {
                            fillColor: '#5E5E5E'
                        },
                        head: [['Name','Total']],
                        body: feeShareList
                    })
                    pdfData = pdfDoc.output()
                }
                return { 
                    record: new AdminJS.BaseRecord({csvData: parsed, pdfData: pdfData, reportTypes: JSON.stringify(reportTypes)}, resource).toJSON(currentAdmin)
                }
            }
        }
    },
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        }
    }
}

module.exports = ReportResosurce