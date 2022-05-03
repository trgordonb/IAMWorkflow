const AdminJS = require('adminjs')
const mongoose = require('mongoose')
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
    dashboard: {
        component: AdminJS.bundle('./components/Dashboard')
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
            lineHeights: 'md'
        }
    },
    resources: [
        { resource: User, options: { parent: menu.Admin, ...UserResource } },
        { resource: AssetAllocation, options: { parent: menu.Account, ...AssetAllocationResource} },
        { resource: AssetAllocation, options: { parent: menu.Account, ...AllAssetAllocationResource }},
        { resource: AccountLedgerBalance, options: { parent: menu.Account, ...AccountLedgerBalanceResource } },
        { resource: AccountPolicy, options: { parent: menu.Account, ...AccountPolicyResource } },
        { resource: Bank, options: { parent: menu.Master, ...BankResource } },
        { resource: Currency, options: { parent: menu.Master, ...CurrencyResource } },
        { resource: CurrencyHistory, options: { parent: menu.Master, ...CurrencyHistoryResource } },
        { resource: Customer, options: { parent: menu.Account, ...CustomerResource } },
        { resource: CustomerTransaction, options: { parent: menu.Account, ...AllCustomerTransactionResource }},
        { resource: CustomerTransaction, options: { parent: menu.Account, ...CustomerTransactionResource }},
        { resource: CustomerPortfolio, options: { parent: menu.Account, ...CustomerPortfolioResource }},
        { resource: CustomerUnitizedPerformance, options: { parent: menu.Account, ...CustomerUnitizedPerformanceResource }},
        { resource: CounterParty, options: { parent: menu.Master, ...CounterPartyResource } },
        { resource: Period, options: { parent: menu.Master, ...PeriodResource } },
        { resource: Role, options: { parent: menu.Master, ...RoleResource } },
        { resource: Payee, options: { parent: menu.Master, ...PayeeResource } },
        { resource: Custodian, options: { parent: menu.Custodian, ...CustodianResource } },
        { resource: AccountCustodian, options: { parent: menu.Custodian, ...AccountCustodianResource } },
        { resource: FeeCode, options: { parent: menu.Fees, ...FeeCodeResource } },
        { resource: AccountFee, options: { parent: menu.Fees, ...AccountFeeResource } },
        { resource: StatementParticular, options: { parent: menu.Fees, ...StatementParticularResource } },
        { resource: FeeSharing, options: { parent: menu.Fees, ...FeeSharingResource } },
        { resource: FeeSharingHistory, options: { parent: menu.Fees, ...FeeSharingHistoryResource } },
        { resource: BankStatementItem, options: { parent: menu.Fees, ...BankStatementItemResource } },
        { resource: Statement, options: { parent: menu.Fees, ...StatementResource } },
        { resource: PolicyFeeSetting, options: { parent: menu.Fees, ...PolicyFeeSettingResource } },
        { resource: Report, options: { parent: menu.Admin, ...ReportResource }},
        { resource: CustodianStatement, options: { parent: menu.Custodian, ...CustodianStatementResource }},
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
                AccountPolicy: 'Customer Policy Settings',
                AccountLedgerBalance: 'Account Ledger Balances',
                AccountCustodian: 'Custodian Policy Settings',
                FeeShareHistory: 'Fee Shares Results',
                FeeCode: 'Fee Codes Maintainence',
                PolicyFeeSetting: 'Policy Fees Setting',
                FeeSharingScheme: 'Fee Share Schemes',
                AccountFee: 'Statement Particular Fee Sharing Settings',
                AssetAllocation: 'Asset Allocation (unchecked)',
                CustomerTransaction: 'Customer Transaction (unchecked)'
            },
            properties: {
                email: 'User Id'
            },
            resources: {
                Customer: {
                    properties: {
                        email: 'Email'
                    }
                },
                AccountPolicy: {
                    properties: {
                        number: 'Custodian Account Number',
                        customer: 'IAM Customer Number',
                        currency: 'Currency'
                    }
                }
            }
        }
    }
}

module.exports = { adminJsConfig, menu }