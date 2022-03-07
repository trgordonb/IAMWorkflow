const mongoose = require('mongoose')
const AdminJS = require('adminjs')
const bcrypt = require('bcrypt')
const moment = require('moment')
const { parse } = require('json2csv');
const CustodianModel = require('./models/custodian.model')
const AccountCustodianModel = require('./models/account-custodian.model')
const AccountPolicyModel = require('./models/account-policy')
const CustomerModel = require('./models/customer-model')
const RoleModel = require('./models/role.model')
const AccountLedgerBalanceModel = require('./models/account-ledger-balance.model')
const FeeCodeModel = require('./models/fee-code.model')
const PayeeModel = require('./models/payee-model')
const StatementParticularModel = require('./models/statement-particular.model')
const CurrencyModel = require('./models/currency.model')
const CurrencyHistoryModel = require('./models/currency-history.model')
const FeeSharingSchemeModel = require('./models/fee-sharing.model')
const AccountFeeModel = require('./models/account-fee.model')
const DemandNoteModel = require('./models/demand-note.model')
const PolicyFeeSettingModel = require('./models/policyfee-setting.model')
const UserModel = require('./models/user.model')
const ReportModel = require('./models/report.model')
const TaskModel = require('./models/task.model')
const EstablishmentFeeShareModel = require('./models/establishment-feeshare.model')
const importExportFeature = require('./features/import-export/index')
const { jsPDF } = require('jspdf/dist/jspdf.node')
const { customRound } = require('./lib/utils')

const menu = {
    Master: { name: 'Main', icon: 'SpineLabel' },
    Reports: { name: 'Report' }
}

const getExportedFileName = (extension) =>
  `export-${moment().format('yyyy-MM-dd_HH-mm')}.${extension}`

    
const adminJsStatic = {
    databases: [mongoose],
    rootPath: '/admin',
    dashboard: {
        component: AdminJS.bundle('./components/CustomDashboard')
    },
    resources: [
        {
            resource: UserModel, options: {
                parent: menu.Master,
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    encryptedPassword: {
                        isVisible: false
                    },
                    password: {
                        type: 'string',
                        isVisible: {
                            list: false, edit: true, filter: false, show: false,
                        }
                    }
                },
                actions: {
                    new: {
                        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
                        before: async(request) => {
                            if (request.payload.password) {
                                request.payload = {
                                    ...request.payload,
                                    encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                                    password: undefined
                                }
                            }
                            return request
                        }
                    },
                    list: {
                        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
                    },
                    edit: {
                        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
                        before: async(request) => {
                            if (request.payload.password) {
                                request.payload = {
                                    ...request.payload,
                                    encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                                    password: undefined
                                }
                            }
                            return request
                        }
                    },
                    show: {
                        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
                    },
                    filter: {
                        isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
                    }
                }
            }
        },
        {
            resource: TaskModel, options: {
                parent: menu.Master,
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    lastRunTime: {
                        isVisible: { list: false, filter: false, show: true, edit: false },
                    },
                    lastRunStatus: {
                        isVisible: { list: false, filter: true, show: true, edit: false },
                    },
                    lastRunDetails: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    }
                },
            }
        },
        { 
            resource: CustodianModel, options: { 
                parent: menu.Master,
                listProperties: ['name'],
                editProperties: ['name'],
                filterProperties: ['name'],
                showProperties: ['name']
            }
        },
        {
            resource: AccountPolicyModel, options: {
                parent: menu.Master,
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    }
                }
            }
        },
        {
            resource: ReportModel, options: {
                parent: menu.Master,
                actions: {
                    export: {
                        actionType: 'record',
                        icon: 'Report',
                        component: AdminJS.bundle('./components/MiniExport.jsx'),
                        handler: async (request, response, context) => {
                            const { record, resource, currentAdmin } = context
                            let exportModel = record.params.source === 'AccountLedgerBalances' ? AccountLedgerBalanceModel : EstablishmentFeeShareModel
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
                                    let resultAccountPolicy = await AccountPolicyModel.findById(doc.accountnumber)
                                    let resultCurrency = await CurrencyModel.findById(doc.currency)
                                    let resultCustodian = await CustodianModel.findById(doc.custodian)
                                    let resultCustomer = await CustomerModel.findById(doc.customer)
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
                                } else if (record.params.source === 'EstablishmentFeeShares') {
                                    reportTypes = ['pdf']
                                    let resultAccountPolicy = await AccountPolicyModel.findById(doc.accountnumber)
                                    let resultCurrency = await CurrencyModel.findById(doc.currency)
                                    let recipients = []
                                    await Promise.all(doc.recipientRecords.map(async (recipient) => {
                                        let resultRole = await RoleModel.findById(recipient.role)
                                        let resultRecipient = await PayeeModel.findById(recipient.recipient)
                                        feeShareTotals[resultRecipient.name] = feeShareTotals.hasOwnProperty(resultRecipient.name) ? feeShareTotals[resultRecipient.name] + recipient.amount : recipient.amount
                                        recipients.push([resultRecipient.name, resultRole.name, customRound(recipient.share), customRound(recipient.amount)])
                                    }))
                                    accumulateTotal = accumulateTotal + doc.totalAmount
                                    let transformedRecord = {
                                        accountnumber: resultAccountPolicy? resultAccountPolicy.number: '',
                                        providerStatement: doc.providerStatement,
                                        particulars: doc.particulars,
                                        recordDate: moment(doc.date).format('YYYY-MM-DD'),
                                        totalAmount: doc.totalAmount,
                                        currency: resultCurrency? resultCurrency.name : '',
                                        recipientRecords: recipients
                                    }
                                    transformedRecords.push(transformedRecord)
                                    const { applyPlugin } = require('./lib/jspdf.plugin.autotable')
                                    applyPlugin(jsPDF)
                                    pdfDoc = new jsPDF()
                                    pdfDoc.text('Establishment Fees Report', 14, 20)
                                    transformedRecords.forEach(record => {
                                        pdfDoc.autoTable({
                                            styles: {
                                                fontSize: 10
                                            },
                                            startY: pdfDoc.lastAutoTable.finalY + 10 || 30,
                                            head: [['Policy#','Provider Statement','Date','Amount']],
                                            columnStyles: {
                                                3: { halign: 'left' }
                                            },
                                            body: [[record.accountnumber, `${record.providerStatement} (${record.particulars})`, moment(record.recordDate).format('YYYY-MM-DD'), customRound(record.totalAmount)]]
                                        })
                                        pdfDoc.autoTable({
                                            styles: {
                                                fontSize: 8
                                            },
                                            headStyles: {
                                                fillColor: '#E4A2C6'
                                            },
                                            startY: pdfDoc.lastAutoTable.finalY + 10,
                                            head: [['Name','Role','Share(%)','Amount']],
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
                                const { applyPlugin } = require('./lib/jspdf.plugin.autotable')
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
                            if (reportTypes.includes('pdf') && record.params.source === 'EstablishmentFeeShares') {
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
                                pdfDoc.text('Total Amount: ' + customRound(accumulateTotal), 14, pdfDoc.lastAutoTable.finalY + 10)
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
        },
        {
            resource: AccountCustodianModel, options: {
                parent: menu.Master,
                listProperties: ['accountPolicyNumber', 'custodian'],
                editProperties: ['accountPolicyNumber', 'custodian'],
                filterProperties: ['accountPolicyNumber', 'custodian'],
                showProperties: ['accountPolicyNumber', 'custodian'],
            }
        },
        {
            resource: CustomerModel, options: {
                parent: menu.Master,
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    clientId: {
                        isTitle: true,
                        isVisible: { list: true, filter: true, show: true, edit: false },
                    },
                    bankaccountnumber: {
                        isVisible: { list: false, filter: true, show: true, edit: true },
                    },
                    address: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    mobile: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    email: {
                        isVisible: { list: false, filter: true, show: true, edit: true },
                    }
                }
            }
        },
        {
            resource: RoleModel, options: {
                parent: menu.Master,
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    }
                }
            }
        },
        {
            resource: AccountLedgerBalanceModel, options: {
                parent: menu.Master,
                actions: {
                    new: {
                        before: async (request, context) => {
                            const { currentAdmin } = context
                            if (request.payload) {
                                request.payload = {
                                    ...request.payload,
                                    lastModifiedBy: currentAdmin._id
                                }
                            }
                            return request
                        }
                    },
                    edit: {
                        isAccessible: ({ currentAdmin, record }) => {
                            return ((currentAdmin && currentAdmin.role === 'admin') || (currentAdmin && currentAdmin.role === 'user' && !record.param('isLocked')))
                        },
                        before: async (request, context) => {
                            const { currentAdmin, record } = context
                            if (request.payload) {
                                request.payload = {
                                    ...request.payload,
                                    lastModifiedBy: currentAdmin._id
                                }
                            }
                            return request
                        }
                    },
                    delete: {
                        isAccessible: ({ currentAdmin, record }) => {
                            return ((currentAdmin && currentAdmin.role === 'admin') || (currentAdmin && currentAdmin.role === 'user' && !record.param('isLocked')))
                        },
                    },
                    import: {
                        actionType: 'resource',
                        isVisible: true,
                        handler: async(request, response, data) => {
                            try {
                                let records = JSON.parse(request.payload.payload)
                                records.forEach(record => {
                                    AccountPolicyModel.findOne({number: record.accountnumber}, async (err, doc) => {
                                        record.accountnumber = doc._id,
                                        record.AUM = parseFloat(record.AUM),
                                        record.NAVDate = new Date(record.NAVDate)
                                        record.currency = doc.currency
                                        const ledgerRecord = new AccountLedgerBalanceModel(record)
                                        await ledgerRecord.save()
                                    })                  
                                })
                                return {
                                    notice: {
                                        message: 'OK',
                                        type: 'success'
                                    }
                                }
                            } catch (err) {
                                return {
                                    notice: {
                                        message: 'Fail',
                                        type: 'error'
                                    }
                                }
                            }                                       
                        }
                    }
                },
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    accountnumber: {
                        isVisible: { list: true, filter: true, show: true, edit: true },
                    },
                    NAVDate: {
                        type: 'date',
                        isVisible: { list: true, filter: true, show: true, edit: true },
                    },
                    tag: {
                        isVisible: { list: true, filter: true, show: true, edit: true },
                    },
                    AUM: {
                        isVisible: { list: true, filter: false, show: true, edit: true },
                    },
                    currency: {
                        isVisible: { list: true, filter: true, show: true, edit: false },
                    },
                    estimatedfee: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    overrideAdvisorFee: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    advisorfee: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    retrocession: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    lastModifiedBy: {
                        isVisible: { list: false, filter: false, show: true, edit: false },
                    },
                    lastModifiedTime: {
                        isVisible: { list: false, filter: false, show: true, edit: false },
                    },
                    isLocked: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    reconcileStatus: {
                        isVisible: { list: false, filter: false, show: true, edit: false },
                    }
                },
            },
            features: [importExportFeature()]
        },
        {
            resource: PolicyFeeSettingModel, options: {
                parent: menu.Master,
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    accountnumber: {
                        isVisible: { list: true, filter: true, show: true, edit: true },
                    },
                    custodian: {
                        isVisible: { list: true, filter: true, show: true, edit: true },
                    },
                    accountopendate: {
                        type: 'date',
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    accountenddate: {
                        type: 'date',
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    accountstatus: {
                        isVisible: { list: true, filter: true, show: true, edit: true },
                    },
                    discretionarymanage: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    advisorfee: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    retrocession: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    }
                }
            }
        },
        {
            resource: FeeCodeModel, options: {
                parent: menu.Master,
                listProperties: ['code', 'value', 'comment'],
                editProperties: ['code', 'value', 'comment'],
                filterProperties:  ['code', 'value', 'comment'],
                showProperties:  ['code', 'value', 'comment']
            }
        },
        { 
            resource: PayeeModel, options: { 
                parent: menu.Master,
                properties: {
                    _id : {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    }
                }
            }
        },
        {
            resource: EstablishmentFeeShareModel, options: {
                actions: {
                    list: {
                        isAccessible: false
                    },
                    new: {
                        isAccessible: false
                    },
                    edit: {
                        isAccessible: false
                    },
                    filter: {
                        isAccessible: false
                    },
                    show: {
                        isAccessible: false
                    }
                }
            }
        },
        { 
            resource: StatementParticularModel, options: { 
                parent: menu.Master,
                listProperties: ['name'],
                editProperties: ['name'],
                filterProperties: ['name'],
                showProperties: ['name']
            }
        },
        { 
            resource: CurrencyModel, options: { 
                properties: {
                    mimeType: {}
                },
                parent: menu.Master,
                listProperties: ['name'],
                editProperties: ['name'],
                filterProperties: ['name'],
                showProperties: ['name'],
            },
        },
        { 
            resource: CurrencyHistoryModel, options: { 
                parent: menu.Master,
                properties: {
                    date: {
                        type: 'date'
                    }
                },
                listProperties: ['currency','date','rate'],
                editProperties: ['currency','date','rate'],
                filterProperties: ['currency','date','rate'],
                showProperties: ['currency','date','rate']
            }
        },
        {
            resource: FeeSharingSchemeModel, options: {
                parent: menu.Master,
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    feerecipients: {
                        isVisible: { list: false, filter: false, show: true, edit: true }
                    }
                }
            }
        },
        {
            resource: AccountFeeModel, options: {
                parent: menu.Master,
                properties: {
                    startDate: {
                        type: 'date'
                    },
                    endDate: {
                        type: 'date'
                    }
                },
                listProperties: ['accountnumber','statementCode','startDate','endDate','feeSharingScheme'],
                editProperties: ['accountnumber','statementCode','startDate','endDate','feeSharingScheme'],
                filterProperties: ['accountnumber','statementCode','startDate','endDate','feeSharingScheme'],
                showProperties: ['accountnumber','statementCode','startDate','endDate','feeSharingScheme']
            }
        },
        {
            resource: DemandNoteModel, options: {
                parent: menu.Master,
                actions: {
                    delete: {
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
                    accountnumber: {
                        isVisible: { list: true, filter: true, show: true, edit: true },
                    },
                    date: {
                        type: 'date',
                        isVisible: { list: true, filter: true, show: true, edit: true },
                    },
                    providerStatement: {
                        isVisible: { list: true, filter: false, show: true, edit: true },
                    },
                    statementCode: {
                        isVisible: { list: true, filter: true, show: true, edit: true },
                    },
                    comment: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    tag: {
                        isVisible: { list: true, filter: true, show: true, edit: true },
                    },
                    serviceFeeStartDate: {
                        type: 'date',
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    serviceFeeEndDate: {
                        type: 'date',
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    receivedDate: {
                        type: 'date',
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    receivedPayee: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    amount: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    currency: {
                        isVisible: { list: false, filter: false, show: true, edit: false },
                    },
                    reconcileStatus: {
                        isVisible: { list: false, filter: false, show: true, edit: false },
                    }
                }
            }
        },
    ],
    version: {
        admin: true,
        app: '1.0.0'
    },
    branding: {
        logo: false,
        companyName: 'Asset Management CRM',
        softwareBrothers: false,
    },
    locale: {
        translations: {
            labels: {
                loginWelcome: 'Welcome to IAM Legacy',
            },
            properties: {
                email: 'User Id'
            },
            resources: {
                DemandNote: {
                    properties: {
                        accountnumber: 'Account Number',
                        providerStatement: 'Demand Note No. /Provider Statement',
                        statementCode: 'Statement Particular Code',
                        serviceFeeStartDate: 'Particular Service Fee Start Date',
                        serviceFeeEndDate: 'Particular Service Fee End Date',
                        receivedPayee: 'Received By Payee',
                    }
                },
                Customer: {
                    properties: {
                        bankaccountnumber: 'Bank Account #'
                    }
                },
                AccountFee: {
                    properties: {
                        accountnumber: 'Account Number',
                        statementCode: 'Statement Particular Code'
                    }
                },
                FeeCode: {
                    properties: {
                        value: 'Value (%)'
                    }
                },
                AccountPolicy: {
                    properties: {
                        number: 'Account Number / Policy Number'
                    }
                },
                AccountCustodian: {
                    properties: {
                        accountPolicyNumber: 'Account Number / Policy Number'
                    }
                },
                PolicyFeeSetting: {
                    properties: {
                        accountnumber: 'Account Number / Policy Number',
                        accountstatus: 'Account Status',
                        accountopendate: 'Account Opening Date',
                        accountenddate: 'Account Ending Date',
                        discretionarymanage: 'Discretionary Management',
                        advisorfee: 'Mgt/Advisory p.a. Fee (%)',
                        retrocession: 'Retrocession p.a. (%)'
                    }
                },
                AccountLedgerBalance: {
                    properties: {
                        accountnumber: 'Account Number / Policy Number',
                        estimatedfee: 'Estimated Fees (%)',
                        advisorfee: 'Mgt/Advisory Fee p.a',
                        retrocession: 'Retrocession p.a.'
                    }
                },
                FeeSharingScheme: {
                    properties: {
                        code: 'Fee Sharing Code',
                        feerecipients: 'Fee Recipients',
                        'feerecipients.recipient': 'Name',
                        'feerecipients.percentage': 'Share (%)',
                        'feerecipients.role': 'Role'
                    }
                },
            }
        }
    }
}

module.exports = { adminJsStatic, menu }