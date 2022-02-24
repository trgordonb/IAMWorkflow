import mongoose from 'mongoose'
import AdminJS from 'adminjs'
import AdminJsMongoose from '@adminjs/mongoose'
import CustodianModel from './models/custodian.model.mjs'
import AccountCustodianModel from './models/account-custodian.model.mjs'
import AccountPolicyModel from './models/account-policy.mjs'
import CustomerModel from './models/customer-model.mjs'
import RoleModel from './models/role.model.mjs'
import AccountLedgerBalanceModel from './models/account-ledger-balance.model.mjs'
import FeeCodeModel from './models/fee-code.model.mjs'
import PayeeModel from './models/payee-model.mjs'
import StatementParticularModel from './models/statement-particular.model.mjs'
import CurrencyModel from './models/currency.model.mjs'
import CurrencyHistoryModel from './models/currency-history.model.mjs'
import FeeSharingSchemeModel from './models/fee-sharing.model.mjs'
import AccountFeeModel from './models/account-fee.model.mjs'
import DemandNoteModel from './models/demand-note.model.mjs'
import PolicyFeeSettingModel from './models/policyfee-setting.model.mjs'
import ReportModel from './models/report.model.mjs'
import EstablishmentFeeShareModel from './models/establishment-feeshare.model.mjs'

const MONGO_URL = process.env.MONGO_URL
AdminJS.registerAdapter(AdminJsMongoose)
await mongoose.connect(MONGO_URL, { useNewUrlParser: true })

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

const menu = {
    Master: { name: 'Main', icon: 'SpineLabel' },
    Reports: { name: 'Report' }
}

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
            parent: menu.Reports,
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

const adminJs = new AdminJS({
    databases: [mongoose],
    rootPath: '/admin',
    resources: [
        ...reportResources,
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
                listProperties: ['number'],
                editProperties: ['number'],
                filterProperties: ['number'],
                showProperties: ['number']
            }
        },
        {
            resource: ReportModel, options: {
                parent: menu.Master,
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
                        isVisible: { list: true, filter: true, show: true, edit: true },
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
                    }
                }
            }
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
                parent: menu.Master,
                listProperties: ['name'],
                editProperties: ['name'],
                filterProperties: ['name'],
                showProperties: ['name']
            }
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
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    }
                }
            }
        },
    ],
    version: {
        admin: false,
        app: '1.0.0'
    },
    branding: {
        logo: false,
        companyName: 'Asset Management CRM',
        softwareBrothers: false,
    },
    locale: {
        translations: {
            resources: {
                ...reportTranslations,
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
})

export default adminJs