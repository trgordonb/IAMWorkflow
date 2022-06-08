const AdminJS = require('adminjs')
const mongoose = require('mongoose')
const loggerConfig = require('./config/logger.config')
const loggerFeature = require('@adminjs/logger').default
const ModifiedLogger = require('./features/logger/modifiedLogger')
const User = require('./models/user.model')
const AssetAllocation = require('./models/asset-allocation.model')
const AccountPolicy = require('./models/account-policy')
const AccountCustodian = require('./models/account-custodian.model')
const AccountLedgerBalance = require('./models/account-ledger-balance.model')
const AccountFee = require('./models/account-fee.model')
const Currency = require('./models/currency.model')
const CurrencyHistory = require('./models/currency-history.model')
const Customer = require('./models/customer-model')
const CustomerTransaction = require('./models/customer-transaction.model')
const CustomerPortfolio = require('./models/customer-portfolio.model')
const CustomerUnitizedPerformance = require('./models/customer-unitized-performance.model')
const BankStatementItem = require('./models/bankstatement-item.model')
const Custodian = require('./models/custodian.model')
const Bank = require('./models/bank.model')
const Period = require('./models/period-model')
const Report = require('./models/report.model')
const Role = require('./models/role.model')
const Payee = require('./models/payee-model')
const FeeCode = require('./models/fee-code.model')
const CounterParty = require('./models/counterparty.model')
const StatementParticular = require('./models/statement-particular.model')
const FeeSharing = require('./models/fee-sharing.model')
const FeeSharingHistory = require('./models/feeshare-history.model')
const Statement = require('./models/statement.model')
const PolicyFeeSetting = require('./models/policyfee-setting.model')
const CustodianStatement = require('./models/custodian-statement-model')
const Message = require('./models/message-model')
const WorkflowConfig = require('./models/workflow-config.model')
const DemandNoteItem = require('./models/demandnote-item.model')
const UserResource = require('./resources/user')
const AssetAllocationResource = require('./resources/asset-allocation')
const AllAssetAllocationResource = require('./resources/all-asset-allocation')
const AccountPolicyResource = require('./resources/account-policy')
const AccountCustodianResource = require('./resources/accountcustodian')
const CurrencyResource = require('./resources/currency')
const CustomerResource = require('./resources/customer')
const AllCustomerTransactionResource = require('./resources/all-customer-transaction')
const CustomerTransactionResource = require('./resources/customer-transaction')
const CustomerPortfolioResource = require('./resources/customer-portfolio')
const CustomerUnitizedPerformanceResource = require('./resources/customer-unitized-performance')
const BankResource = require('./resources/bank')
const PeriodResource = require('./resources/period')
const RoleResource = require('./resources/role')
const PayeeResource = require('./resources/payee')
const CustodianResource = require('./resources/custodian')
const FeeCodeResource = require('./resources/feecode')
const CounterPartyResource = require('./resources/counterparty')
const AccountFeeResource = require('./resources/account-fee')
const AccountLedgerBalanceResource = require('./resources/account-ledger-balance')
const StatementParticularResource = require('./resources/statement-particular')
const FeeSharingResource = require('./resources/fee-sharing')
const StatementResource = require('./resources/statement')
const BankStatementItemResource = require('./resources/bank-statement-item')
const CurrencyHistoryResource = require('./resources/currency-history')
const FeeSharingHistoryResource = require('./resources/fee-sharing-history')
const PolicyFeeSettingResource = require('./resources/policy-fee-setting')
const ReportResource = require('./resources/report')
const CustodianStatementResource = require('./resources/custodian-statement')
const MessageResource = require('./resources/message')
const LogResource = require('./resources/log')
const WorkflowConfigResource = require('./resources/workflow-config')
const DemandNoteItemResource = require('./resources/demand-note-item')

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
        logo: 'https://oh-estore.s3.amazonaws.com/AOCLogo.png',
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
        { resource: AssetAllocation, options: { parent: menu.Account, ...AssetAllocationResource} },
        { resource: AssetAllocation, options: { parent: menu.Account, ...AllAssetAllocationResource }},
        { resource: AccountLedgerBalance, options: { parent: menu.Account, ...AccountLedgerBalanceResource } },
        { resource: AccountPolicy, options: { navigation: 'Admin Module', ...AccountPolicyResource } },
        { resource: Bank, options: { parent: menu.Master, ...BankResource } },
        { resource: Currency, options: { navigation: 'Admin Module', ...CurrencyResource } },
        { resource: CurrencyHistory, options: { parent: menu.Master, ...CurrencyHistoryResource } },
        { resource: Customer, options: { navigation: 'Admin Module', ...CustomerResource } },
        { resource: CustomerTransaction, options: { parent: menu.Account, ...AllCustomerTransactionResource }},
        { resource: CustomerTransaction, options: { navigation: 'Quarterly Workflow Module', ...CustomerTransactionResource },
            features: [
                loggerFeature(loggerConfig), ModifiedLogger('CustomerTransaction')
            ]
        },
        { resource: CustomerPortfolio, options: { navigation: 'Admin Module', ...CustomerPortfolioResource }},
        { resource: CustomerUnitizedPerformance, options: { navigation: 'Quarterly Workflow Module', ...CustomerUnitizedPerformanceResource }},
        { resource: CounterParty, options: { parent: menu.Master, ...CounterPartyResource } },
        { resource: Period, options: { navigation: 'Admin Module', ...PeriodResource } },
        { resource: Role, options: { parent: menu.Master, ...RoleResource } },
        { resource: Payee, options: { parent: menu.Master, ...PayeeResource } },
        { resource: Custodian, options: { navigation: 'Admin Module', ...CustodianResource } },
        { resource: AccountCustodian, options: { parent: menu.Custodian, ...AccountCustodianResource } },
        { resource: FeeCode, options: { navigation: 'Admin Module', ...FeeCodeResource } },
        { resource: AccountFee, options: { parent: menu.Fees, ...AccountFeeResource } },
        { resource: StatementParticular, options: { parent: menu.Fees, ...StatementParticularResource } },
        { resource: FeeSharing, options: { parent: menu.Fees, ...FeeSharingResource } },
        { resource: FeeSharingHistory, options: { parent: menu.Fees, ...FeeSharingHistoryResource } },
        { resource: BankStatementItem, options: { parent: menu.Fees, ...BankStatementItemResource } },
        { resource: Statement, options: { parent: menu.Fees, ...StatementResource } },
        { resource: PolicyFeeSetting, options: { parent: menu.Fees, ...PolicyFeeSettingResource } },
        { resource: Report, options: { parent: menu.Admin, ...ReportResource }},
        { resource: CustodianStatement, options: { navigation: 'Quarterly Workflow Module', ...CustodianStatementResource }, 
            features: [
                loggerFeature(loggerConfig), ModifiedLogger('Custodian Statement')
            ]
        },
        { resource: Message, options: { navigation: 'Admin Module', ...MessageResource }},
        { resource: WorkflowConfig, options: { navigation: 'Quarterly Workflow Module', ...WorkflowConfigResource }},
        { resource: DemandNoteItem, options: { navigation: 'Quarterly Workflow Module', ...DemandNoteItemResource }},
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
                Period: 'Report Periods',
                CounterParty: 'Custodians',
                Bank: 'Settlement Banks',
                Role: 'Company Roles',
                User: 'Portal Users',
                Report: 'Reports',
                Custodian: 'Custodians',
                Customer: 'Customers',
                Statement: 'Custodian Statements',
                StatementParticular: 'Custodian Particulars',
                Payee: 'Company Payees',
                BankStatementItem: 'Bank Statements',
                AccountPolicy: 'Custodian Accounts',
                AccountLedgerBalance: 'Account Ledger Balances',
                AccountCustodian: 'Custodian Policy Settings',
                FeeShareHistory: 'Fee Shares Results',
                FeeCode: 'Fee Codes',
                PolicyFeeSetting: 'Policy Fees Setting',
                FeeSharingScheme: 'Fee Share Schemes',
                AccountFee: 'Statement Particular Fee Sharing Settings',
                AssetAllocation: 'Asset Allocation (unchecked)',
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
                        currency: 'Currency'
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
                }
            }
        }
    }
}

module.exports = { adminJsConfig, menu }