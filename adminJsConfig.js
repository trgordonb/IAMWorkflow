const AdminJS = require('adminjs')
const mongoose = require('mongoose')
const loggerConfig = require('./config/logger.config')
const loggerFeature = require('@adminjs/logger').default
const ModifiedLogger = require('./features/logger/modifiedLogger')
const User = require('./models/user.model')
const AccountPolicy = require('./models/account-policy')
const Currency = require('./models/currency.model')
const Customer = require('./models/customer-model')
const CustomerTransaction = require('./models/customer-transaction.model')
const CustomerPortfolio = require('./models/customer-portfolio.model')
const CustomerUnitizedPerformance = require('./models/customer-unitized-performance.model')
const BankStatementItem = require('./models/bankstatement-item.model')
const Period = require('./models/period-model')
const Role = require('./models/role.model')
const Report = require('./models/report.model')
const FeeCode = require('./models/fee-code.model')
const FeeSharing = require('./models/fee-sharing.model')
const FeeShareResult = require('./models/feeshare-result.model')
const CustodianStatement = require('./models/custodian-statement-model')
const Message = require('./models/message-model')
const WorkflowConfig = require('./models/workflow-config.model')
const { StatementItem } = require('./models/statement-item.model')
const CurrencyPair = require('./models/currency-pair.model')
const StatementSummary = require('./models/statement-summary-model')
const RecipientFeeShare = require('./models/recipient-feeshare.model')
const Party = require('./models/party-model')
const UserResource = require('./resources/user')
const AccountPolicyResource = require('./resources/account-policy')
const CurrencyResource = require('./resources/currency')
const CustomerResource = require('./resources/customer')
const CustomerTransactionResource = require('./resources/customer-transaction')
const CustomerPortfolioResource = require('./resources/customer-portfolio')
const CustomerUnitizedPerformanceResource = require('./resources/customer-unitized-performance')
const PeriodResource = require('./resources/period')
const RoleResource = require('./resources/role')
const FeeCodeResource = require('./resources/feecode')
const FeeSharingResource = require('./resources/fee-sharing')
const BankStatementItemResource = require('./resources/bank-statement-item')
const FeeShareResultResource = require('./resources/feeshare-result')
const CustodianStatementResource = require('./resources/custodian-statement')
const MessageResource = require('./resources/message')
const LogResource = require('./resources/log')
const ReportResource = require('./resources/report')
const WorkflowConfigResource = require('./resources/workflow-config')
const StatementItemResource = require('./resources/statement-item')
const CurrencyPairResource = require('./resources/currency-pair')
const StatementSummaryResource = require('./resources/statement-summary')
const RecipientFeeShareResource = require('./resources/recipient-feeshare')
const PartyResource = require('./resources/party')

const menu = {
    Admin: { name: 'Admin/Reports' },
    Account: { name: 'Accounts' },
    Master: { name: 'Masters' },
    Custodian: { name: 'Custodians' },
    Fees: { name: 'Fees' },
}

const adminJsConfig = {
    databases: [mongoose],
    rootPath: '/admin',
    assets: {
        scripts: [
            '/socket.io/socket.io.js'
        ],
        styles: [
            'https://iamlegacy.s3.ap-northeast-2.amazonaws.com/DatePicker.css'
        ]
    },
    dashboard: {
        component: AdminJS.bundle('./components/Dashboard.jsx')
    },
    version: {
        admin: true,
        app: '1.0.0'
    },
    branding: {
        logo: 'https://iamlegacy.s3.ap-northeast-2.amazonaws.com/IAMLogo.jpg',
        companyName: 'I-AMS',
        softwareBrothers: false,
        theme: {
            fontSizes: 'md',
            lineHeights: 'md',
            font: "Interstate",
            colors: {
                primary20: "#FCD1B7",
                primary60: "#F49F70",
                primary100: "#B2644B"
            }
        }
    },
    resources: [
        { ...LogResource, options: { ...LogResource.options, navigation: 'Admin Module' } },
        { resource: User, options: { navigation: 'Admin Module', ...UserResource } },
        { resource: AccountPolicy, options: { navigation: 'Master Module', ...AccountPolicyResource } },
        { resource: Currency, options: { navigation: 'Master Module', ...CurrencyResource } },
        { resource: Customer, options: { navigation: 'Master Module', ...CustomerResource } },
        { resource: CustomerTransaction, options: { navigation: 'Quarterly Workflow Module', ...CustomerTransactionResource },
            features: [
                loggerFeature(loggerConfig), ModifiedLogger('CustomerTransaction')
            ]
        },
        { resource: CustomerPortfolio, options: { navigation: 'Master Module', ...CustomerPortfolioResource }},
        { resource: CustomerUnitizedPerformance, options: { navigation: 'Quarterly Workflow Module', ...CustomerUnitizedPerformanceResource }},
        { resource: Period, options: { navigation: 'Master Module', ...PeriodResource } },
        { resource: Role, options: { navigation: 'Master Module', ...RoleResource } },
        { resource: FeeCode, options: { navigation: 'Master Module', ...FeeCodeResource } },
        { resource: FeeSharing, options: { navigation: 'Master Module', ...FeeSharingResource } },
        { resource: FeeShareResult, options: { navigation: 'Quarterly Workflow Module', ...FeeShareResultResource } },
        { resource: Report, options: { navigation: 'Master Module', ...ReportResource } },
        { resource: BankStatementItem, options: { navigation: 'Quarterly Workflow Module', ...BankStatementItemResource },
            features: [
                loggerFeature(loggerConfig), ModifiedLogger('BankStatementItem')
            ]
        },
        { resource: CustodianStatement, options: { navigation: 'Quarterly Workflow Module', ...CustodianStatementResource }, 
            features: [
                loggerFeature(loggerConfig), ModifiedLogger('Custodian Statement')
            ]
        },
        { resource: Message, options: { navigation: 'Admin Module', ...MessageResource }},
        { resource: WorkflowConfig, options: { navigation: 'Quarterly Workflow Module', ...WorkflowConfigResource }},
        { resource: StatementItem, options: { navigation: 'Quarterly Workflow Module', ...StatementItemResource }},
        { resource: CurrencyPair, options: { navigation: 'Master Module', ...CurrencyPairResource }},
        { resource: StatementSummary, options: { navigation: 'Quarterly Workflow Module', ...StatementSummaryResource },
            features: [
                loggerFeature(loggerConfig), ModifiedLogger('StatementSummary')
            ]
        },
        { resource: Party, options: { navigation: 'Master Module', ...PartyResource }},
        { resource: RecipientFeeShare, options: { navigation: 'Quarterly Workflow Module', ...RecipientFeeShareResource }},
    ],
    locale: {
        translations: {
            messages: {
                loginWelcome: 'Integrated Asset Management System'
            },
            labels: {
                loginWelcome: 'I-AMS',
                CurrencyHistory: 'Currency Histories',
                Currency: 'Currencies',
                Period: 'Periods',
                CounterParty: 'Counter Party',
                Bank: 'Settlement Banks',
                Role: 'Entity Roles',
                User: 'Portal Users',
                Report: 'Reports',
                Custodian: 'Custodians',
                Customer: 'Customers',
                Statement: 'Custodian Statements',
                StatementParticular: 'Custodian Particulars',
                Payee: 'Company Accounts',
                BankStatementItem: 'Bank Statements',
                AccountPolicy: 'Custodian Accounts',
                AccountCustodian: 'Custodian Policy Settings',
                FeeShareHistory: 'Fee Shares Results',
                FeeCode: 'Fee Codes',
                PolicyFeeSetting: 'Policy Fees Setting',
                FeeSharingScheme: 'Fee Share Schemes',
                AccountFee: 'Statement Particular Fee Sharing Settings',
                CustomerTransaction: 'Customer Transactions',
                Message: 'System Messages',
                CustomerPortfolio: 'Portfolio Unit Definition',
                DemandNoteItem: 'Demand Note Records',
                'Workflow Configuration': 'Workflow',
                CustomerUnitizedPerformance: 'Unitized Performance',
                CustomerTransaction: 'Deposit/Withdrawal'
            },
            properties: {
                email: 'User Id'
            },
            resources: {
                User: {
                    properties: {
                        email: 'Email'
                    }
                },
                Customer: {
                    properties: {
                        email: 'Email',
                        bankaccountnumber: 'Bank Account Number'
                    }
                },
                AccountPolicy: {
                    properties: {
                        number: 'Custodian Account Number',
                        customer: 'IAM Customer Number',
                        currency: 'Currency',
                        feeCode: 'Mgt Fee Code',
                        'feeSharing.feeType': 'Transaction Type',
                        'feeSharing.feeSharingScheme': 'Scheme Code'
                    }
                },
                Period: {
                    properties: {
                        subPeriodEndDates: 'Sub Periods',
                        'subPeriodEndDates.date': 'Date',
                        'subPeriodEndDates.name': 'Name'
                    }
                },
                'Custodian Statement': {
                    properties: {
                        cashValue: 'Cash',
                        equitiesValue: 'Equities',
                        derivativesValue: 'Derivatives',
                        bondsValue: 'Bonds',
                        alternativesValue: 'Alternatives',
                        custodianAccount: 'Account',
                        statementDate: 'Date'
                    }
                },
                CustomerPortfolio: {
                    properties: {
                        currency: 'Reporting Currency',
                        startUnit: 'Initial number of units',
                        accountPolicyNumber: 'Custodian Accounts'
                    }
                },
                Log: {
                    properties: {
                        createdAt: 'Last Modified At'
                    }
                },
                CustomerUnitizedPerformance: {
                    properties: {
                        lastSubPeriodDate: 'Last Period',
                        lastSubPeriodUnit: 'Last Period Unit',
                        lastSubPeriodNAV: 'Last Period NAV',
                        currentSubPeriodDate: 'Date',
                        currentSubPeriodUnit: 'Unit', 
                        currentSubPeriodNAV: 'NAV',
                        currentSubPeriodNAVPerUnit: 'Unit NAV',
                        currentSubPeriodDeposited: 'Deposit Amount',
                        currentSubPeriodWithdrawn: 'Withdraw Amount',
                        currentSubPeriodUnitsDeposited: 'Unit deposited',
                        currentSubPeriodUnitsWithdrawn: 'Unit withdrawn',
                        netChange: 'Net Change',
                        unitizedChange: 'Unitized Change'
                    }
                },
                StatementSummary: {
                    properties: {
                        'details.custodianAccount': 'Custodian Account',
                        'details.amount': 'Amount',
                        'details.feeCodeApplied': 'Fee Code'
                    }
                },
                FeeSharingScheme: {
                    properties: {
                        feerecipients: 'Fee Recipients',
                        'feerecipients.role': 'Role',
                        'feerecipients.percentage': 'Percenatge',
                        'feerecipients.recipient': 'Recipient'
                    }
                },
                BankStatementItem: {
                    properties: {
                        companyAccount: 'Company Account'
                    }
                }
            }
        }
    }
}

module.exports = { adminJsConfig, menu }