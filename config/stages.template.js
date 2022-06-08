const stages = [
    {
        number: 1,
        completed: false,
        label: 'Month 1',
        actions: [{
            actionName: 'genuperf',
            label: 'Generate unitized performance records'
        }],
        data: [
            {
                name: 'CustodianAccountsCount',
                modelName: 'AccountPolicy',
                queries: [{
                    property: 'status',
                    value: 'Active',
                    operator: 'equal'
                }, {
                    property: 'accountStartDate',
                    value: 'placeholder:tmpRecord.subPeriodEndDates[0]',
                    operator: 'lessthanorequal'
                }],
                value: 0,
                locked: false
            }, 
            {
                name: 'PendCustodianStatementsCount',
                modelName: 'CustodianStatement',
                queries: [
                {
                    property: 'period',
                    value: 'placeholder:tmpRecord.period',
                    operator: 'equal'
                },
                {
                    property: 'statementDate',
                    value: 'placeholder:tmpRecord.subPeriodEndDates[0]',
                    operator: 'equal'
                },
                {
                    property: 'status',
                    value: 'or:pending,approved',
                    operator: 'orequal'
                }],
                value: 0,
                locked: false         
            },
            {
                name: 'ApprovedCustodianStatementsCount',
                modelName: 'CustodianStatement',
                queries: [
                {
                    property: 'status',
                    value: 'approved',
                    operator: 'equal'
                },
                {
                    property: 'statementDate',
                    value: 'placeholder:tmpRecord.subPeriodEndDates[0]',
                    operator: 'equal'
                },
                {
                    property: 'period',
                    value: 'placeholder:tmpRecord.period',
                    operator: 'equal'
                }],
                value: 0,
                locked: false
            },
            {
                name: 'CustomerTransactionAllCount',
                modelName: 'CustomerTransaction',
                queries: [
                {
                    property: 'period',
                    value: 'placeholder:tmpRecord.period',
                    operator: 'equal'
                },
                {
                    property: 'date',
                    value: 'placeholder:period.start,tmpRecord.subPeriodEndDates[0]',
                    operator: 'range'
                }],
                value: 0,
                locked: false
            }, 
            {
                name: 'CustomerTransactionApprovedCount',
                modelName: 'CustomerTransaction',
                queries: [
                {
                    property: 'period',
                    value: 'placeholder:tmpRecord.period',
                    operator: 'equal'
                }, 
                {
                    property: 'date',
                    value: 'placeholder:period.start,tmpRecord.subPeriodEndDates[0]',
                    operator: 'range'
                },
                {
                    property: 'status',
                    value: 'approved',
                    operator: 'equal'
                }],
                value: 0,
                locked: false         
            }, 
            {
                name: 'CustomerAccountCount',
                modelName: 'CustomerPortfolio',
                queries: [
                {
                    property: 'startDate',
                    value: 'placeholder:tmpRecord.subPeriodEndDates[0]',
                    operator: 'lessthanorequal'
                }],
                value: 0,
                locked: false
            },
            {
                name: 'UnitizedPerfRecordPendCount',
                modelName: 'CustomerUnitizedPerformance',
                queries: [
                    {
                        property: 'period',
                        value: 'placeholder:tmpRecord.period',
                        operator: 'equal'
                    },
                    {
                        property: 'currentSubPeriodDate',
                        value: 'placeholder:tmpRecord.subPeriodEndDates[0]',
                        operator: 'equal'
                    },
                    {
                        property: 'status',
                        value: 'or:pending,approved',
                        operator: 'orequal'
                    }
                ],
                value: 0,
                locked: false
            },
            {
                name: 'UnitizedPerfRecordApprovedCount',
                modelName: 'CustomerUnitizedPerformance',
                queries: [
                    {
                        property: 'period',
                        value: 'placeholder:tmpRecord.period',
                        operator: 'equal'
                    },
                    {
                        property: 'currentSubPeriodDate',
                        value: 'placeholder:tmpRecord.subPeriodEndDates[0]',
                        operator: 'equal'
                    },
                    {
                        property: 'status',
                        value: 'approved',
                        operator: 'equal'
                    }
                ],
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
            },
            {
                code: 'S1T3',
                description: 'All customer transactions have been appoved',
                status: 'pending',
                rule: {
                    source: 'CustomerTransactionAllCount',
                    target: 'CustomerTransactionApprovedCount'
                },
                stat: '0 / 0'
            },
            {
                code: 'S1T4',
                description: 'All customer unitized performance records have been generated',
                status: 'pending',
                rule: {
                    source: 'CustomerAccountCount',
                    target: 'UnitizedPerfRecordPendCount'
                },
                stat: '0 / 0'
            },
            {
                code: 'S1T5',
                description: 'All unitized performance records has been approved',
                status: 'pending',
                rule: {
                    source: 'UnitizedPerfRecordPendCount',
                    target: 'UnitizedPerfRecordApprovedCount'
                },
                stat: '0 / 0'
            }
        ],
    },
    {
        number: 2,
        completed: false,
        label: 'Month 2',
        actions: [{
            actionName: 'genuperf',
            label: 'Generate unitized performance records'
        }],
        data: [
            {
                name: 'CustodianAccountsCount',
                modelName: 'AccountPolicy',
                queries: [{
                    property: 'status',
                    value: 'Active',
                    operator: 'equal'
                }, {
                    property: 'accountStartDate',
                    value: 'placeholder:tmpRecord.subPeriodEndDates[1]',
                    operator: 'lessthanorequal'
                }],
                value: 0,
                locked: false
            }, 
            {
                name: 'PendCustodianStatementsCount',
                modelName: 'CustodianStatement',
                queries: [
                {
                    property: 'period',
                    value: 'placeholder:tmpRecord.period',
                    operator: 'equal'
                },
                {
                    property: 'statementDate',
                    value: 'placeholder:tmpRecord.subPeriodEndDates[1]',
                    operator: 'equal'
                },
                {
                    property: 'status',
                    value: 'or:pending,approved',
                    operator: 'orequal'
                }],
                value: 0,
                locked: false         
            },
            {
                name: 'ApprovedCustodianStatementsCount',
                modelName: 'CustodianStatement',
                queries: [
                {
                    property: 'status',
                    value: 'approved',
                    operator: 'equal'
                },
                {
                    property: 'statementDate',
                    value: 'placeholder:tmpRecord.subPeriodEndDates[1]',
                    operator: 'equal'
                },
                {
                    property: 'period',
                    value: 'placeholder:tmpRecord.period',
                    operator: 'equal'
                }],
                value: 0,
                locked: false
            },
            {
                name: 'CustomerTransactionAllCount',
                modelName: 'CustomerTransaction',
                queries: [
                {
                    property: 'period',
                    value: 'placeholder:tmpRecord.period',
                    operator: 'equal'
                },
                {
                    property: 'date',
                    value: 'placeholder:tmpRecord.subPeriodEndDates[0],tmpRecord.subPeriodEndDates[1]',
                    operator: 'range'
                }],
                value: 0,
                locked: false
            }, 
            {
                name: 'CustomerTransactionApprovedCount',
                modelName: 'CustomerTransaction',
                queries: [
                {
                    property: 'period',
                    value: 'placeholder:tmpRecord.period',
                    operator: 'equal'
                }, 
                {
                    property: 'date',
                    value: 'placeholder:tmpRecord.subPeriodEndDates[0],tmpRecord.subPeriodEndDates[1]',
                    operator: 'range'
                },
                {
                    property: 'status',
                    value: 'approved',
                    operator: 'equal'
                }],
                value: 0,
                locked: false         
            }, 
            {
                name: 'CustomerAccountCount',
                modelName: 'CustomerPortfolio',
                queries: [
                {
                    property: 'startDate',
                    value: 'placeholder:tmpRecord.subPeriodEndDates[1]',
                    operator: 'lessthanorequal'
                }],
                value: 0,
                locked: false
            },
            {
                name: 'UnitizedPerfRecordPendCount',
                modelName: 'CustomerUnitizedPerformance',
                queries: [
                    {
                        property: 'period',
                        value: 'placeholder:tmpRecord.period',
                        operator: 'equal'
                    },
                    {
                        property: 'currentSubPeriodDate',
                        value: 'placeholder:tmpRecord.subPeriodEndDates[1]',
                        operator: 'equal'
                    },
                    {
                        property: 'status',
                        value: 'or:pending,approved',
                        operator: 'orequal'
                    }
                ],
                value: 0,
                locked: false
            },
            {
                name: 'UnitizedPerfRecordApprovedCount',
                modelName: 'CustomerUnitizedPerformance',
                queries: [
                    {
                        property: 'period',
                        value: 'placeholder:tmpRecord.period',
                        operator: 'equal'
                    },
                    {
                        property: 'currentSubPeriodDate',
                        value: 'placeholder:tmpRecord.subPeriodEndDates[1]',
                        operator: 'equal'
                    },
                    {
                        property: 'status',
                        value: 'approved',
                        operator: 'equal'
                    }
                ],
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
            },
            {
                code: 'S2T3',
                description: 'All customer transactions have been appoved',
                status: 'pending',
                rule: {
                    source: 'CustomerTransactionAllCount',
                    target: 'CustomerTransactionApprovedCount'
                },
                stat: '0 / 0'
            },
            {
                code: 'S2T4',
                description: 'All customer unitized performance records have been generated',
                status: 'pending',
                rule: {
                    source: 'CustomerAccountCount',
                    target: 'UnitizedPerfRecordPendCount'
                },
                stat: '0 / 0'
            },
            {
                code: 'S2T5',
                description: 'All unitized performance records has been approved',
                status: 'pending',
                rule: {
                    source: 'UnitizedPerfRecordPendCount',
                    target: 'UnitizedPerfRecordApprovedCount'
                },
                stat: '0 / 0'
            }
        ],
    },
    {
        number: 3,
        completed: false,
        label: 'Month 3',
        actions: [{
            actionName: 'genuperf',
            label: 'Generate unitized performance records'
        },{
            actionName: 'gendnote',
            label: 'Generate demand note records'
        }],
        data: [
            {
                name: 'CustodianAccountsCount',
                modelName: 'AccountPolicy',
                queries: [{
                    property: 'status',
                    value: 'Active',
                    operator: 'equal'
                }, {
                    property: 'accountStartDate',
                    value: 'placeholder:tmpRecord.subPeriodEndDates[2]',
                    operator: 'lessthanorequal'
                }],
                value: 0,
                locked: false
            }, 
            {
                name: 'PendCustodianStatementsCount',
                modelName: 'CustodianStatement',
                queries: [
                {
                    property: 'period',
                    value: 'placeholder:tmpRecord.period',
                    operator: 'equal'
                },
                {
                    property: 'statementDate',
                    value: 'placeholder:tmpRecord.subPeriodEndDates[2]',
                    operator: 'equal'
                },
                {
                    property: 'status',
                    value: 'or:pending,approved',
                    operator: 'orequal'
                }],
                value: 0,
                locked: false         
            },
            {
                name: 'ApprovedCustodianStatementsCount',
                modelName: 'CustodianStatement',
                queries: [
                {
                    property: 'status',
                    value: 'approved',
                    operator: 'equal'
                },
                {
                    property: 'statementDate',
                    value: 'placeholder:tmpRecord.subPeriodEndDates[2]',
                    operator: 'equal'
                },
                {
                    property: 'period',
                    value: 'placeholder:tmpRecord.period',
                    operator: 'equal'
                }],
                value: 0,
                locked: false
            },
            {
                name: 'CustomerTransactionAllCount',
                modelName: 'CustomerTransaction',
                queries: [
                {
                    property: 'period',
                    value: 'placeholder:tmpRecord.period',
                    operator: 'equal'
                },
                {
                    property: 'date',
                    value: 'placeholder:tmpRecord.subPeriodEndDates[1],tmpRecord.subPeriodEndDates[2]',
                    operator: 'range'
                }],
                value: 0,
                locked: false
            }, 
            {
                name: 'CustomerTransactionApprovedCount',
                modelName: 'CustomerTransaction',
                queries: [
                {
                    property: 'period',
                    value: 'placeholder:tmpRecord.period',
                    operator: 'equal'
                }, 
                {
                    property: 'date',
                    value: 'placeholder:tmpRecord.subPeriodEndDates[1],tmpRecord.subPeriodEndDates[2]',
                    operator: 'range'
                },
                {
                    property: 'status',
                    value: 'approved',
                    operator: 'equal'
                }],
                value: 0,
                locked: false         
            },
            {
                name: 'CustomerAccountCount',
                modelName: 'CustomerPortfolio',
                queries: [
                {
                    property: 'startDate',
                    value: 'placeholder:tmpRecord.subPeriodEndDates[2]',
                    operator: 'lessthanorequal'
                }],
                value: 0,
                locked: false
            },
            {
                name: 'UnitizedPerfRecordPendCount',
                modelName: 'CustomerUnitizedPerformance',
                queries: [
                    {
                        property: 'period',
                        value: 'placeholder:tmpRecord.period',
                        operator: 'equal'
                    },
                    {
                        property: 'currentSubPeriodDate',
                        value: 'placeholder:tmpRecord.subPeriodEndDates[2]',
                        operator: 'equal'
                    },
                    {
                        property: 'status',
                        value: 'or:pending,approved',
                        operator: 'orequal'
                    }
                ],
                value: 0,
                locked: false
            },
            {
                name: 'UnitizedPerfRecordApprovedCount',
                modelName: 'CustomerUnitizedPerformance',
                queries: [
                    {
                        property: 'period',
                        value: 'placeholder:tmpRecord.period',
                        operator: 'equal'
                    },
                    {
                        property: 'currentSubPeriodDate',
                        value: 'placeholder:tmpRecord.subPeriodEndDates[2]',
                        operator: 'equal'
                    },
                    {
                        property: 'status',
                        value: 'approved',
                        operator: 'equal'
                    }
                ],
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
            },
            {
                code: 'S3T3',
                description: 'All customer transactions have been appoved',
                status: 'pending',
                rule: {
                    source: 'CustomerTransactionAllCount',
                    target: 'CustomerTransactionApprovedCount'
                },
                stat: '0 / 0'
            },
            {
                code: 'S3T4',
                description: 'All customer unitized performance records have been generated',
                status: 'pending',
                rule: {
                    source: 'CustomerAccountCount',
                    target: 'UnitizedPerfRecordPendCount'
                },
                stat: '0 / 0'
            },
            {
                code: 'S3T5',
                description: 'All unitized performance records has been approved',
                status: 'pending',
                rule: {
                    source: 'UnitizedPerfRecordPendCount',
                    target: 'UnitizedPerfRecordApprovedCount'
                },
                stat: '0 / 0'
            }
        ],
    },
    {
        number: 4,
        completed: false,
        label: 'Demand Note',
        actions: [{
            actionName: 'printdn',
            label: 'Print Demand Notes'
        }],
        data: [
            {
                name: 'AllActiveCustodianAccounts',
                modelName: 'AccountPolicy',
                queries: [
                    {
                        property: 'status',
                        value: 'Active',
                        operator: 'equal'
                    },
                ],
                value: 0,
                locked: false
            },
            {
                name: 'AllDemandNotesItems',
                modelName: 'DemandNoteItem',
                queries: [
                    {
                        property: 'period',
                        value: 'placeholder:tmpRecord.period',
                        operator: 'equal'
                    }
                ],
                value: 0,
                locked: false
            }
        ],
        tasks: [
            {
                code: 'S4T1',
                description: 'All accounts have been included in demand notes',
                status: 'pending',
                rule: {
                    source: 'AllActiveCustodianAccounts',
                    target: 'AllDemandNotesItems'
                },
                stat: '0 / 0'
            }
        ]
    }
]

module.exports = stages