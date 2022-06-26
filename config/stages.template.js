const stages = [
    {
        number: 1,
        completed: false,
        label: 'Month 1',
        actions: [{
            actionName: 'genuperf',
            label: 'Generate unitized performance records',
            taskCode: 'S1T4',
        }],
        currentTaskNumber: 0,
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
                    value: 'placeholder:tmpRecord.subPeriodEndDates[0].date',
                    operator: 'lessthanorequal'
                }],
                subPath: '',
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
                    value: 'placeholder:tmpRecord.subPeriodEndDates[0].date',
                    operator: 'equal'
                },
                {
                    property: 'status',
                    value: 'or:pending,approved',
                    operator: 'orequal'
                }],
                subPath: '',
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
                    value: 'placeholder:tmpRecord.subPeriodEndDates[0].date',
                    operator: 'equal'
                },
                {
                    property: 'period',
                    value: 'placeholder:tmpRecord.period',
                    operator: 'equal'
                }],
                subPath: '',
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
                    value: 'placeholder:period.start,tmpRecord.subPeriodEndDates[0].date',
                    operator: 'range'
                }],
                subPath: '',
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
                    value: 'placeholder:period.start,tmpRecord.subPeriodEndDates[0].date',
                    operator: 'range'
                },
                {
                    property: 'status',
                    value: 'approved',
                    operator: 'equal'
                }],
                subPath: '',
                value: 0,
                locked: false         
            }, 
            {
                name: 'CustomerAccountCount',
                modelName: 'CustomerPortfolio',
                queries: [
                {
                    property: 'startDate',
                    value: 'placeholder:tmpRecord.subPeriodEndDates[0].date',
                    operator: 'lessthanorequal'
                }],
                subPath: '',
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
                        value: 'placeholder:tmpRecord.subPeriodEndDates[0].date',
                        operator: 'equal'
                    },
                    {
                        property: 'status',
                        value: 'or:pending,approved',
                        operator: 'orequal'
                    }
                ],
                subPath: '',
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
                        value: 'placeholder:tmpRecord.subPeriodEndDates[0].date',
                        operator: 'equal'
                    },
                    {
                        property: 'status',
                        value: 'approved',
                        operator: 'equal'
                    }
                ],
                subPath: '',
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
                type: 'action',
                status: 'pending',
            },
            {
                code: 'S1T5',
                description: 'All customer unitized performance records have been correctly generated by system for user approval',
                status: 'pending',
                rule: {
                    source: 'CustomerAccountCount',
                    target: 'UnitizedPerfRecordPendCount'
                },
                stat: '0 / 0'
            },
            {
                code: 'S1T6',
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
            label: 'Generate unitized performance records',
            taskCode: 'S2T4',
        }],
        currentTaskNumber: 0,
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
                    value: 'placeholder:tmpRecord.subPeriodEndDates[1].date',
                    operator: 'lessthanorequal'
                }],
                subPath: '',
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
                    value: 'placeholder:tmpRecord.subPeriodEndDates[1].date',
                    operator: 'equal'
                },
                {
                    property: 'status',
                    value: 'or:pending,approved',
                    operator: 'orequal'
                }],
                subPath: '',
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
                    value: 'placeholder:tmpRecord.subPeriodEndDates[1].date',
                    operator: 'equal'
                },
                {
                    property: 'period',
                    value: 'placeholder:tmpRecord.period',
                    operator: 'equal'
                }],
                subPath: '',
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
                    value: 'placeholder:tmpRecord.subPeriodEndDates[0].date,tmpRecord.subPeriodEndDates[1].date',
                    operator: 'range'
                }],
                subPath: '',
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
                    value: 'placeholder:tmpRecord.subPeriodEndDates[0].date,tmpRecord.subPeriodEndDates[1].date',
                    operator: 'range'
                },
                {
                    property: 'status',
                    value: 'approved',
                    operator: 'equal'
                }],
                subPath: '',
                value: 0,
                locked: false         
            }, 
            {
                name: 'CustomerAccountCount',
                modelName: 'CustomerPortfolio',
                queries: [
                {
                    property: 'startDate',
                    value: 'placeholder:tmpRecord.subPeriodEndDates[1].date',
                    operator: 'lessthanorequal'
                }],
                subPath: '',
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
                        value: 'placeholder:tmpRecord.subPeriodEndDates[1].date',
                        operator: 'equal'
                    },
                    {
                        property: 'status',
                        value: 'or:pending,approved',
                        operator: 'orequal'
                    }
                ],
                subPath: '',
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
                        value: 'placeholder:tmpRecord.subPeriodEndDates[1].date',
                        operator: 'equal'
                    },
                    {
                        property: 'status',
                        value: 'approved',
                        operator: 'equal'
                    }
                ],
                subPath: '',
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
                type: 'action',
                status: 'pending',
            },
            {
                code: 'S2T5',
                description: 'All customer unitized performance records have been correctly generated by system for user approval',
                status: 'pending',
                rule: {
                    source: 'CustomerAccountCount',
                    target: 'UnitizedPerfRecordPendCount'
                },
                stat: '0 / 0'
            },
            {
                code: 'S2T6',
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
            label: 'Generate unitized performance records',
            taskCode: 'S3T4',
        },],
        currentTaskNumber: 0,
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
                    value: 'placeholder:tmpRecord.subPeriodEndDates[2].date',
                    operator: 'lessthanorequal'
                }],
                subPath: '',
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
                    value: 'placeholder:tmpRecord.subPeriodEndDates[2].date',
                    operator: 'equal'
                },
                {
                    property: 'status',
                    value: 'or:pending,approved',
                    operator: 'orequal'
                }],
                subPath: '',
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
                    value: 'placeholder:tmpRecord.subPeriodEndDates[2].date',
                    operator: 'equal'
                },
                {
                    property: 'period',
                    value: 'placeholder:tmpRecord.period',
                    operator: 'equal'
                }],
                subPath: '',
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
                    value: 'placeholder:tmpRecord.subPeriodEndDates[1].date,tmpRecord.subPeriodEndDates[2].date',
                    operator: 'range'
                }],
                subPath: '',
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
                    value: 'placeholder:tmpRecord.subPeriodEndDates[1].date,tmpRecord.subPeriodEndDates[2].date',
                    operator: 'range'
                },
                {
                    property: 'status',
                    value: 'approved',
                    operator: 'equal'
                }],
                subPath: '',
                value: 0,
                locked: false         
            },
            {
                name: 'CustomerAccountCount',
                modelName: 'CustomerPortfolio',
                queries: [
                {
                    property: 'startDate',
                    value: 'placeholder:tmpRecord.subPeriodEndDates[2].date',
                    operator: 'lessthanorequal'
                }],
                subPath: '',
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
                        value: 'placeholder:tmpRecord.subPeriodEndDates[2].date',
                        operator: 'equal'
                    },
                    {
                        property: 'status',
                        value: 'or:pending,approved',
                        operator: 'orequal'
                    }
                ],
                subPath: '',
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
                        value: 'placeholder:tmpRecord.subPeriodEndDates[2].date',
                        operator: 'equal'
                    },
                    {
                        property: 'status',
                        value: 'approved',
                        operator: 'equal'
                    }
                ],
                subPath: '',
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
                type: 'action',
                status: 'pending',
            },
            {
                code: 'S3T5',
                description: 'All customer unitized performance records have been correctly generated by system for user approval',
                status: 'pending',
                rule: {
                    source: 'CustomerAccountCount',
                    target: 'UnitizedPerfRecordPendCount'
                },
                stat: '0 / 0'
            },
            {
                code: 'S3T6',
                description: 'All unitized performance records has been approved',
                status: 'pending',
                rule: {
                    source: 'UnitizedPerfRecordPendCount',
                    target: 'UnitizedPerfRecordApprovedCount'
                },
                stat: '0 / 0'
            },
        ],
    },
    {
        number: 4,
        completed: false,
        label: 'Demand Note',
        actions: [{
            actionName: 'printdn',
            label: 'Print Demand Notes',
            taskCode: 'S4T5',
        },{
            actionName: 'gendnote',
            label: 'Generate demand note records',
            taskCode: 'S4T1',
        }],
        currentTaskNumber: 0,
        data: [
            {
                name: 'ExistingCurrencyPairs',
                modelName: 'CurrencyPair',
                queries: [],
                subPath: '',
                value: 0,
                locked: false
            },
            {
                name: 'CurrentPeriodCurrencyPairs',
                modelName: 'Period',
                queries: [
                    {
                        property: '_id',
                        value: 'placeholder:tmpRecord.period',
                        operator: 'equal'
                    }
                ],
                subPath: 'exchangeRates',
                value: 0,
                locked: false
            },
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
                subPath: '',
                value: 0,
                locked: false
            },
            {
                name: 'AllDemandNotesItems',
                modelName: 'StatementSummary',
                queries: [
                    {
                        property: 'period',
                        value: 'placeholder:tmpRecord.period',
                        operator: 'equal'
                    },
                    {
                        property: 'type',
                        value: 'ManagementFee',
                        operator: 'equal'
                    },
                    {
                        property: 'status',
                        value: 'or:pending,approved',
                        operator: 'equal'
                    }
                ],
                subPath: 'details',
                value: 0,
                locked: false
            },
            {
                name: 'AllRetrocessionItems',
                modelName: 'StatementSummary',
                queries: [
                    {
                        property: 'period',
                        value: 'placeholder:tmpRecord.period',
                        operator: 'equal'
                    },
                    {
                        property: 'type',
                        value: 'RetrocessionFee',
                        operator: 'equal'
                    },
                    {
                        property: 'status',
                        value: 'or:pending,approved',
                        operator: 'equal'
                    }
                ],
                subPath: 'details',
                value: 0,
                locked: false
            },
            {
                name: 'ApprovedDemandNotesItems',
                modelName: 'StatementSummary',
                queries: [
                    {
                        property: 'period',
                        value: 'placeholder:tmpRecord.period',
                        operator: 'equal'
                    },
                    {
                        property: 'type',
                        value: 'ManagementFee',
                        operator: 'equal'
                    },
                    {
                        property: 'status',
                        value: 'approved',
                        operator: 'equal'
                    }
                ],
                subPath: 'details',
                value: 0,
                locked: false
            },
            {
                name: 'ApprovedRetrocessionItems',
                modelName: 'StatementSummary',
                queries: [
                    {
                        property: 'period',
                        value: 'placeholder:tmpRecord.period',
                        operator: 'equal'
                    },
                    {
                        property: 'type',
                        value: 'RetrocessionFee',
                        operator: 'equal'
                    },
                    {
                        property: 'status',
                        value: 'approved',
                        operator: 'equal'
                    }
                ],
                subPath: 'details',
                value: 0,
                locked: false
            },
        ],
        tasks: [
            {
                code: 'S4T1',
                type: 'action',
                status: 'pending',
            },
            {
                code: 'S4T2',
                description: 'All end-of-period exchange rates have been entered',
                status: 'pending',
                rule: {
                    source: 'ExistingCurrencyPairs',
                    target: 'CurrentPeriodCurrencyPairs'
                },
                stat: '0 / 0'
            },
            {
                code: 'S4T3',
                description: 'All accounts have been included in demand notes',
                status: 'pending',
                rule: {
                    source: 'AllActiveCustodianAccounts',
                    target: 'AllDemandNotesItems'
                },
                stat: '0 / 0'
            },
            {
                code: 'S4T4',
                description: 'All demand notes records have been approved',
                status: 'pending',
                rule: {
                    source: 'AllDemandNotesItems',
                    target: 'ApprovedDemandNotesItems'
                },
                stat: '0 / 0'
            },
            {
                code: 'S4T5',
                type: 'action',
                status: 'pending',
            },
            {
                code: 'S4T6',
                description: 'All retrocession fees items have been entered and approved',
                status: 'pending',
                rule: {
                    source: 'AllRetrocessionItems',
                    target: 'ApprovedRetrocessionItems'
                },
                stat: '0 / 0'
            }
        ]
    }, 
    {
        number: 5,
        completed: false,
        label: 'Bank Statements Handling',
        actions: [{
            actionName: 'bankchargecalc',
            label: 'Allocate Bank Charges',
            taskCode: 'S5T3',
        }],
        currentTaskNumber: 0,
        data: [
            {
                name: 'MatchedBankStatementItems',
                modelName: 'BankStatementItem',
                queries: [
                    {
                        property: 'period',
                        value: 'placeholder:tmpRecord.period',
                        operator: 'equal'
                    },
                    {
                        property: 'status',
                        value: 'or:pending,approved',
                        operator: 'equal'
                    }
                ],
                subPath: '',
                value: 0,
                locked: false
            },
            {
                name: 'AllStatementSummaries',
                modelName: 'StatementSummary',
                queries: [
                    {
                        property: 'period',
                        value: 'placeholder:tmpRecord.period',
                        operator: 'equal'
                    },
                    {
                        property: 'status',
                        value: 'approved',
                        operator: 'equal'
                    },
                    {
                        property: 'type',
                        value: 'or:ManagementFee,RetrocessionFee',
                        operator: 'equal'
                    }
                ],
                subPath: '',
                value: 0,
                locked: false
            },
            {
                name: 'ApprovedBankStatementItems',
                modelName: 'BankStatementItem',
                queries: [
                    {
                        property: 'period',
                        value: 'placeholder:tmpRecord.period',
                        operator: 'equal'
                    },
                    {
                        property: 'status',
                        value: 'approved',
                        operator: 'equal'
                    }
                ],
                subPath: '',
                value: 0,
                locked: false
            },
            {
                name: 'AllStatementItems',
                modelName: 'StatementItem',
                queries: [
                    {
                        property: 'period',
                        value: 'placeholder:tmpRecord.period',
                        operator: 'equal'
                    },
                ],
                subPath: '',
                value: 0,
                locked: false
            },
            {
                name: 'AllAllocatedStatementItems',
                modelName: 'StatementItem',
                queries: [
                    {
                        property: 'period',
                        value: 'placeholder:tmpRecord.period',
                        operator: 'equal'
                    },
                    {
                        property: 'reconcilation.completed',
                        value: true,
                        operator: 'equal'
                    }
                ],
                value: 0,
                locked: false
            }
        ],
        tasks: [
            {
                code: 'S5T1',
                description: 'All bank statement items have been input',
                status: 'pending',
                rule: {
                    source: 'AllStatementSummaries',
                    target: 'MatchedBankStatementItems'
                },
                stat: '0 / 0'
            },
            {
                code: 'S5T2',
                description: 'All matched bank statement items have been approved',
                status: 'pending',
                rule: {
                    source: 'MatchedBankStatementItems',
                    target: 'ApprovedBankStatementItems'
                },
                stat: '0 / 0'
            },
            {
                code: 'S5T3',
                type: 'action',
                status: 'pending',
            },
            {
                code: 'S5T4',
                description: 'All statement items have been allocated bank charges',
                status: 'pending',
                rule: {
                    source: 'AllStatementItems',
                    target: 'AllAllocatedStatementItems'
                },
                stat: '0 / 0'
            }
        ]
    },
    {
        number: 6,
        completed: false,
        label: 'Fees Distribution',
        actions: [{
            actionName: 'feedist',
            label: 'Distribute fees',
            taskCode: 'S6T1',
        }, {
            actionName: 'printdist',
            label: 'Print Fee Distribution Report',
            taskCode: 'S6T2',
        }, {
            actionName: 'showgraph',
            label: 'Show Fee Distribution Stat',
            taskCode: 'S6T3',
        }],
        currentTaskNumber: 0,
        data: [],
        tasks: [
            {
                code: 'S6T1',
                type: 'action',
                status: 'pending',
            },
            {
                code: 'S6T2',
                type: 'action',
                status: 'pending',
            },
            {
                code: 'S6T3',
                type: 'action',
                status: 'pending',
            }
        ]
    }
]

module.exports = stages