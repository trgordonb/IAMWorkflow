const stages = [
    {
        number: 1,
        completed: false,
        label: 'Custodian Statements',
        data: [
            {
                name: 'CustodianAccountsCount',
                resourceId: 'AccountPolicy',
                queries: [{
                    property: 'filters.status',
                    value: 'Active'
                }],
                factor: 3,
                value: 0,
                locked: false
            }, 
            {
                name: 'PendCustodianStatementsCount',
                resourceId: 'Custodian Statement',
                queries: [
                {
                    property: 'filters.status',
                    value: 'pending'
                }, 
                {
                    property: 'filters.period',
                    value: 'current'
                }],
                factor: 1,
                value: 0,
                locked: false         
            },
            {
                name: 'ApprovedCustodianStatementsCount',
                resourceId: 'Custodian Statement',
                queries: [
                {
                    property: 'filters.status',
                    value: 'approved'
                },
                {
                    property: 'filters.period',
                    value: 'current'
                }],
                factor: 1,
                value: 0,
                locked: false
            }
        ],
        tasks: [
            {
                code: 'S1T1',
                description: 'All custodian accounts month-end balances entered',
                status: 'pending',
                rule: {
                    source: 'CustodianAccountsCount',
                    target: 'PendCustodianStatementsCount'
                },
                stat: '0 / 0'
            },
            {
                code: 'S1T2',
                description: 'All custodian statement items approved',
                status: 'pending',
                rule: {
                    source: 'PendCustodianStatementsCount',
                    target: 'ApprovedCustodianStatementsCount'
                },
                stat: '0 / 0'
            }
        ],
    },
    {
        number: 2,
        completed: false,
        label: 'Stage 2',
        data: [
            {
                name: 'CustodianAccountsCount',
                resourceId: 'AccountPolicy',
                queries: [{
                    property: 'filters.status',
                    value: 'Active'
                }],
                factor: 3,
                value: 0,
                locked: false
            }, 
            {
                name: 'PendCustodianStatementsCount',
                resourceId: 'Custodian Statement',
                queries: [
                {
                    property: 'filters.status',
                    value: 'pending'
                }, 
                {
                    property: 'filters.period',
                    value: 'current'
                }],
                factor: 1,
                value: 0,
                locked: false         
            },
            {
                name: 'ApprovedCustodianStatementsCount',
                resourceId: 'Custodian Statement',
                queries: [
                {
                    property: 'filters.status',
                    value: 'approved'
                },
                {
                    property: 'filters.period',
                    value: 'current'
                }],
                factor: 1,
                value: 0,
                locked: false
            }
        ],
        tasks: [
            {
                code: 'S2T1',
                description: 'All custodian accounts month-end balances entered',
                status: 'pending',
                rule: {
                    source: 'CustodianAccountsCount',
                    target: 'PendCustodianStatementsCount'
                },
                stat: '0 / 0'
            },
            {
                code: 'S2T2',
                description: 'All custodian statement items approved',
                status: 'pending',
                rule: {
                    source: 'PendCustodianStatementsCount',
                    target: 'ApprovedCustodianStatementsCount'
                },
                stat: '0 / 0'
            }
        ],
    },
    {
        number: 3,
        completed: false,
        label: 'Stage 3',
        data: [
            {
                name: 'CustodianAccountsCount',
                resourceId: 'AccountPolicy',
                queries: [{
                    property: 'filters.status',
                    value: 'Active'
                }],
                factor: 3,
                value: 0,
                locked: false
            }, 
            {
                name: 'PendCustodianStatementsCount',
                resourceId: 'Custodian Statement',
                queries: [
                {
                    property: 'filters.status',
                    value: 'pending'
                }, 
                {
                    property: 'filters.period',
                    value: 'current'
                }],
                factor: 1,
                value: 0,
                locked: false         
            },
            {
                name: 'ApprovedCustodianStatementsCount',
                resourceId: 'Custodian Statement',
                queries: [
                {
                    property: 'filters.status',
                    value: 'approved'
                },
                {
                    property: 'filters.period',
                    value: 'current'
                }],
                factor: 1,
                value: 0,
                locked: false
            }
        ],
        tasks: [
            {
                code: 'S3T1',
                description: 'All custodian accounts month-end balances entered',
                status: 'pending',
                rule: {
                    source: 'CustodianAccountsCount',
                    target: 'PendCustodianStatementsCount'
                },
                stat: '0 / 0'
            },
            {
                code: 'S3T2',
                description: 'All custodian statement items approved',
                status: 'pending',
                rule: {
                    source: 'PendCustodianStatementsCount',
                    target: 'ApprovedCustodianStatementsCount'
                },
                stat: '0 / 0'
            }
        ],   
    }
]

module.exports = stages