const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const AdminJsMongoose = require('@adminjs/mongoose')
AdminJS.registerAdapter(AdminJsMongoose)

const mongoose = require('mongoose')
const MONGO_URL = process.env.MONGO_URL
const express = require('express')
const app = express()

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
const EstablishmentFeeShareModel = require('./models/establishment-feeshare.model')

const menu = {
    Master: { name: 'Main', icon: 'SpineLabel' },
    Report: { name: 'Reports' }
}

const adminJs = new AdminJS({
    databases: [mongoose],
    rootPath: '/admin',
    dashboard: {
        component: AdminJS.bundle('./components/CustomDashboard')
    },
    resources: [
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
                listProperties: ['clientId', 'name'],
                editProperties: ['clientId', 'name'],
                filterProperties: ['clientId', 'name'],
                showProperties: ['clientId', 'Name'],
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
        {
            resource: EstablishmentFeeShareModel, options: {
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
                parent: menu.Report,
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    demandnote: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    accountnumber: {
                        isVisible: { list: true, filter: true, show: true, edit: false },
                    },
                    date: {
                        type: 'date',
                        isVisible: { list: true, filter: true, show: true, edit: false },
                    },
                    providerStatement: {
                        isVisible: { list: true, filter: false, show: true, edit: false },
                    },
                    particulars: {
                        isVisible: { list: false, filter: false, show: true, edit: false },
                    },
                    receivedDate: {
                        type: 'date',
                        isVisible: { list: true, filter: false, show: true, edit: false },
                    },
                    currency: {
                        isVisible: { list: false, filter: true, show: true, edit: false },
                    },
                    recipientRecords: {
                        isVisible: { list: false, filter: false, show: true, edit: false },
                    }
                },

            }
        }
    ],
    version: {
        admin: false,
        app: '1.0.0'
    },
    branding: {
        logo: false,
        companyName: 'IAM Legacy',
        softwareBrothers: false,
    },
    locale: {
        translations: {
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
                EstablishmentFeeShare: {
                    properties: {
                        accountnumber: 'Account Number',
                        providerStatement: 'Demand Note No. /Provider Statement',
                        recipientRecords: 'Paid to:',
                        'recipientRecords.recipient': 'Name',
                        'recipientRecords.amount': 'Amount',
                        'recipientRecords.role': 'as'
                    }
                }
            }
        }
    }
})

const ADMIN = {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'lovejs',
}

const router = AdminJSExpress.buildRouter(adminJs)

app.use(adminJs.options.rootPath, router)

const run = async () => {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true
    })
    await app.listen(process.env.PORT, () => {
        console.log('AdminJS is at localhost:8080/admin')
    })
}

run()