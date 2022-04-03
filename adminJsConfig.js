const AdminJS = require('adminjs')
const mongoose = require('mongoose')
const User = require('./models/user.model')
const AssetAllocation = require('./models/asset-allocation.model')
const AccountPolicy = require('./models/account-policy')
const Currency = require('./models/currency.model')
const Customer = require('./models/customer-model')
const CustomerTransaction = require('./models/customer-transaction.model')
const CustomerPortfolio = require('./models/customer-portfolio.model')
const CustomerUnitizedPerformance = require('./models/customer-unitized-performance.model')
const UserResource = require('./resources/user')
const AssetAllocationResource = require('./resources/asset-allocation')
const AllAssetAllocationResource = require('./resources/all-asset-allocation')
const AccountPolicyResource = require('./resources/account-policy')
const CurrencyResource = require('./resources/currency')
const CustomerResource = require('./resources/customer')
const AllCustomerTransactionResource = require('./resources/all-customer-transaction')
const CustomerTransactionResource = require('./resources/customer-transaction')
const CustomerPortfolioResource = require('./resources/customer-portfolio')
const CustomerUnitizedPerformanceResource = require('./resources/customer-unitized-performance')

const menu = {
    Admin: { name: 'Admin/Reports' },
    Account: { name: 'Accounts' },
    Master: { name: 'Masters' },
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
    },
    resources: [
        { resource: User, options: { parent: menu.Admin, ...UserResource } },
        { resource: AssetAllocation, options: { parent: menu.Account, ...AssetAllocationResource} },
        { resource: AssetAllocation, options: { parent: menu.Account, ...AllAssetAllocationResource }},
        { resource: AccountPolicy, options: { parent: menu.Account, ...AccountPolicyResource } },
        { resource: Currency, options: { parent: menu.Master, ...CurrencyResource } },
        { resource: Customer, options: { parent: menu.Account, ...CustomerResource } },
        { resource: CustomerTransaction, options: { parent: menu.Account, ...AllCustomerTransactionResource }},
        { resource: CustomerTransaction, options: { parent: menu.Account, ...CustomerTransactionResource }},
        { resource: CustomerPortfolio, options: { parent: menu.Account, ...CustomerPortfolioResource }},
        { resource: CustomerUnitizedPerformance, options: { parent: menu.Account, ...CustomerUnitizedPerformanceResource }},
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
            }
        }
    }
}

module.exports = { adminJsConfig, menu }