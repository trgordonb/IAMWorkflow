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
const AccountLedgerBalanceModel = require('./models/account-ledger-balance.model')
const FeeCodeModel = require('./models/fee-code.model')
const PayeeModel = require('./models/payee-model')
const StatementParticularModel = require('./models/statement-particular.model')
const CurrencyModel = require('./models/currency.model')
const CurrencyHistoryModel = require('./models/currency-history.model')
const FeeSharingSchemeModel = require('./models/fee-sharing.model')
const AccountFeeModel = require('./models/account-fee.model')
const DemandNoteModel = require('./models/demand-note.model')

//const menu = {
//    Master: { name: 'Master', icon: 'SpineLabel' },
//}

const adminJs = new AdminJS({
    databases: [mongoose],
    rootPath: '/admin',
    resources: [
        { 
            resource: CustodianModel, options: { 
                listProperties: ['name'],
                editProperties: ['name'],
                filterProperties: ['name'],
                showProperties: ['name']
            }
        },
        {
            resource: AccountPolicyModel, options: {
                listProperties: ['number'],
                editProperties: ['number'],
                filterProperties: ['number'],
                showProperties: ['number']
            }
        },
        {
            resource: AccountCustodianModel, options: {
                listProperties: ['accountPolicyNumber', 'custodian'],
                editProperties: ['accountPolicyNumber', 'custodian'],
                filterProperties: ['accountPolicyNumber', 'custodian'],
                showProperties: ['accountPolicyNumber', 'custodian'],
            }
        },
        {
            resource: CustomerModel, options: {
                listProperties: ['clientId', 'name'],
                editProperties: ['clientId', 'name'],
                filterProperties: ['clientId', 'name'],
                showProperties: ['clientId', 'Name'],
            }
        },
        {
            resource: AccountLedgerBalanceModel, options: {
                listProperties: ['client', 'accountnumber', 'accountstatus'],
                editProperties: ['client', 'accountnumber', 'accountstatus', 'accountopendate', 'accountenddate', 'discretionarymanage',
                'aum_USD', 'aum_HKD', 'aum_EUR', 'estimatedfee', 'advisorfee', 'retrocession'],
                filterProperties: ['client', 'accountnumber', 'accountstatus', 'accountopendate', 'accountenddate', 'discretionarymanage'],
                showProperties: ['client', 'accountnumber', 'accountstatus', 'accountopendate', 'accountenddate', 'discretionarymanage',
                'aum_USD', 'aum_HKD', 'aum_EUR', 'estimatedfee', 'advisorfee', 'retrocession'],
            }
        },
        {
            resource: FeeCodeModel, options: {
                listProperties: ['code', 'value', 'comment'],
                editProperties: ['code', 'value', 'comment'],
                filterProperties:  ['code', 'value', 'comment'],
                showProperties:  ['code', 'value', 'comment']
            }
        },
        { 
            resource: PayeeModel, options: { 
                listProperties: ['name'],
                editProperties: ['name'],
                filterProperties: ['name'],
                showProperties: ['name']
            }
        },
        { 
            resource: StatementParticularModel, options: { 
                listProperties: ['name'],
                editProperties: ['name'],
                filterProperties: ['name'],
                showProperties: ['name']
            }
        },
        { 
            resource: CurrencyModel, options: { 
                listProperties: ['name'],
                editProperties: ['name'],
                filterProperties: ['name'],
                showProperties: ['name']
            }
        },
        { 
            resource: CurrencyHistoryModel, options: { 
                listProperties: ['currency','date','rate'],
                editProperties: ['currency','date','rate'],
                filterProperties: ['currency','date','rate'],
                showProperties: ['currency','date','rate']
            }
        },
        {
            resource: FeeSharingSchemeModel, options: {
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    introducer: {
                        isVisible: { list: false, filter: true, show: true, edit: true },
                    },
                    introducerRebate: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    marketingManager: {
                        isVisible: { list: false, filter: true, show: true, edit: true },
                    },
                    marketingManagerRebate: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    relationshipManager: {
                        isVisible: { list: false, filter: true, show: true, edit: true },
                    },
                    relationshipManagerRebate: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    teamLeader: {
                        isVisible: { list: false, filter: true, show: true, edit: true },
                    },
                    teamLeaderRebate: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    assistant: {
                        isVisible: { list: false, filter: true, show: true, edit: true },
                    },
                    assistantRebate: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    teamAdviser: {
                        isVisible: { list: false, filter: true, show: true, edit: true },
                    },
                    teamAdviserRebate: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    companyWealth: {
                        isVisible: { list: false, filter: true, show: true, edit: true },
                    },
                    companyWealthRebate: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    }
                }
            }
        },
        {
            resource: AccountFeeModel, options: {
                listProperties: ['accountnumber','startDate','endDate','feeSharingScheme'],
                editProperties: ['accountnumber','startDate','endDate','feeSharingScheme'],
                filterProperties: ['accountnumber','startDate','endDate','feeSharingScheme'],
                showProperties: ['accountnumber','startDate','endDate','feeSharingScheme']
            }
        },
        {
            resource: DemandNoteModel, options: {
                properties: {
                    _id: {
                        isVisible: { list: false, filter: false, show: false, edit: false },
                    },
                    accountnumber: {
                        isVisible: { list: true, filter: true, show: true, edit: true },
                    },
                    date: {
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
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    serviceFeeEndDate: {
                        isVisible: { list: false, filter: false, show: true, edit: true },
                    },
                    receivedDate: {
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
        }
    ],
    version: {
        admin: false,
        app: '1.0.0'
    },
    branding: {
        logo: false,
        companyName: 'IAM Legacy',
        softwareBrothers: false
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
                AccountLedgerBalance: {
                    properties: {
                        accountnumber: 'Account Number / Policy Number',
                        accountstatus: 'Account Status',
                        accountopendate: 'Account Opening Date',
                        accountenddate: 'Account Ending Date',
                        discretionarymanage: 'Discretionary Management',
                        aum_USD: 'AUM (USD)',
                        aum_HKD: 'AUM (HKD)',
                        aum_EUR: 'AUM (EUR)',
                        estimatedfee: 'Estimated Fees',
                        advisorfee: 'Mgt/Advisory p.a. Fee (%)',
                        retrocession: 'Retrocession p.a. (%)'
                    }
                },
                FeeSharingScheme: {
                    properties: {
                        code: 'Fee Sharing Code',
                        introducerRebate: 'Introducer Rebate (%)',
                        teamLeader: 'Team Leader / PM / Backup RM',
                        teamLeaderRebate: 'Team Leader / PM / Backup RM Rebate (%)',
                        marketingManagerRebate: 'Marketing Manager Rebate (%)',
                        relationshipManagerRebate: 'Relationship Manager Rebate (%)',
                        assistant: 'Portfolio/Support Assistant',
                        assistantRebate: 'Portfolio/Support Assistant Rebate (%)',
                        teamAdviserRebate: 'Team Adviser Rebate (%)',
                        companyWealthRebate: 'Company Wealth Rebate (%)'
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