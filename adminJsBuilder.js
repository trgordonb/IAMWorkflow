const mongoose = require('mongoose')
const AdminJS = require('adminjs')
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
const ReportModel = require('./models/report.model')
const EstablishmentFeeShareModel = require('./models/establishment-feeshare.model')
const importExportFeature = require('./features/import-export/index')

const menu = {
    Master: { name: 'Main', icon: 'SpineLabel' },
    Reports: { name: 'Report' }
}
    
const adminJsStatic = {
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
                actions: {
                    import: {
                        actionType: 'resource',
                        handler: async(request, response, data) => {
                            try {
                                const records = JSON.parse(request.payload.payload)
                                let hasRequiredFields = true
                                records.forEach(record => {
                                    if (!record.hasOwnProperty('name')) {
                                        hasRequiredFields = false
                                    }
                                })
                                if (records.length > 0 && hasRequiredFields) {
                                    await CurrencyModel.insertMany(records)
                                    return {
                                        notice: {
                                            message: 'OK',
                                            type: 'success'
                                        }
                                    } 
                                } else {
                                    return {
                                        notice: {
                                            message: 'Fail',
                                            type: 'error'
                                        }
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
                    mimeType: {}
                },
                parent: menu.Master,
                listProperties: ['name'],
                editProperties: ['name'],
                filterProperties: ['name'],
                showProperties: ['name'],
            },
            features: [importExportFeature()]
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