import { Box, Button, Text } from '@adminjs/design-system'
import { useRecord, BasePropertyComponent, useTranslation, ApiClient } from 'adminjs'
import { useHistory } from 'react-router'
import { useDropzone } from 'react-dropzone'

const CustodianStatementShow = (props) => {
    const { record: initialRecord, resource, action } = props
    const [clientId, setClientId] = React.useState('')
    const [total, setTotal] = React.useState(0)
    const [cashAllocation, setCashAllocation] = React.useState(0)
    const [equitiesAllocation, setEquitiesAllocation] = React.useState(0)
    const [derivativesAllocation, setDerivativesAllocation] = React.useState(0)
    const [bondsAllocation, setBondsAllocation] = React.useState(0)
    const [alternativesAllocation, setAlternativesAllocation] = React.useState(0)
    let valuesList = []
    const [docURL, setDocURL] = React.useState([]);
    const onDrop = React.useCallback(acceptedFiles => {
        setDocURL(URL.createObjectURL(acceptedFiles[0]))
    }, [])
    const {getRootProps, getInputProps} = useDropzone({onDrop})
    const allKeys = ['cashValue','equitiesValue','derivativesValue','bondsValue','alternativesValue']

    const { record, handleChange, submit } = useRecord(initialRecord, resource.id)
    const history = useHistory()
    const api = new ApiClient()

    React.useEffect(() => {
        const fetchCustomer = async() => {
            const result = await api.recordAction({
                resourceId: 'Customer',
                recordId: initialRecord.populated.custodianAccount.params.customer,
                actionName: 'show'
            })
            if (result.request && result.request.statusText === 'OK') {
                setClientId(result.data.record.params.clientId)
            }
        }
        if (initialRecord && initialRecord.params) {
            setCashAllocation(initialRecord.params.cashAllocation)
            setEquitiesAllocation(initialRecord.params.equitiesAllocation)
            setDerivativesAllocation(initialRecord.params.derivativesAllocation)
            setBondsAllocation(initialRecord.params.bondsAllocation)
            setAlternativesAllocation(initialRecord.params.alternativesAllocation)
            setTotal(initialRecord.params.total)
        }
        if (initialRecord && initialRecord.populated.custodianAccount.params.customer) {
            fetchCustomer()
        }
        let curTotal = 0
        Object.keys(record.params).filter(key => (allKeys.indexOf(key) >= 0)).forEach(key => {
            curTotal = curTotal + parseFloat(record.params[key])
        })
        setTotal(curTotal)
        setCashAllocation(record.params.cashValue ? (100 * parseFloat(record.params.cashValue) / curTotal).toFixed(2) : 0)
        setEquitiesAllocation(record.params.equitiesValue ? (100 * parseFloat(record.params.equitiesValue) / curTotal).toFixed(2) : 0)
        setDerivativesAllocation(record.params.derivativesValue ? (100 * parseFloat(record.params.derivativesValue) / curTotal).toFixed(2) : 0)
        setBondsAllocation(record.params.bondsValue ? (100 * parseFloat(record.params.bondsValue) / curTotal).toFixed(2) : 0)
        setAlternativesAllocation(record.params.alternativesValue ? (100 * parseFloat(record.params.alternativesValue) / curTotal).toFixed(2) : 0)
    },[initialRecord, valuesList])

    return (
    <>
    <Box flex flexDirection={'row'}>
        <Box>
            <div {...getRootProps()} style={{borderWidth: 5}}>
                <input {...getInputProps()} style={{borderWidth: 5}} />
            </div>
            <iframe width={1000} height={800} src={docURL} type="application/pdf"/>
        </Box>
        <Box py='lg' marginX={25}>
            <Box flex flexDirection={'row'}>
                <Box flexGrow={0} marginRight={5}>
                    <BasePropertyComponent
                        where="show"
                        property={resource.properties.custodianAccount}
                        resource={resource}
                        record={record}
                    />
                </Box>
                <Box flexShrink={1} marginLeft={10} alignSelf='auto'>
                    <Text>Customer Id</Text>
                    <Text style={{marginTop:8}}>{clientId}</Text>
                </Box>
            </Box>          
            <Box flex flexDirection={'row'}>
                <Box flexGrow={0} marginRight={15}>
                    <BasePropertyComponent
                        where="show"
                        property={resource.properties.statementDate}
                        resource={resource}
                        record={record}
                    >
                    </BasePropertyComponent>
                </Box>                   
            </Box>
            <Box flex flexDirection={'row'}>
                <Box flexGrow={0}>
                    <BasePropertyComponent
                        where="show"
                        property={resource.properties.currency}
                        resource={resource}
                        record={record}
                    />
                </Box>                   
            </Box>
            <Box flex flexDirection={'row'}>
                <Box flexGrow={0} marginRight={15}>
                    <BasePropertyComponent
                        where="show"
                        property={resource.properties.cashValue}
                        resource={resource}
                        record={record}
                    />
                </Box>
                <Box flexGrow={0} alignSelf='auto'>
                    <Text>Allocation</Text>
                    <Text style={{marginTop:5}}>{`${cashAllocation}%`}</Text>
                </Box>
            </Box>
            
            <Box flex flexDirection={'row'}>
                <Box flexGrow={0} marginRight={15}>
                    <BasePropertyComponent
                        where="show"
                        property={resource.properties.equitiesValue}
                        resource={resource}
                        record={record}
                    />
                </Box>
                <Box flexGrow={0} alignSelf='auto'>
                    <Text>Allocation</Text>
                    <Text style={{marginTop:5}}>{`${equitiesAllocation}%`}</Text>
                </Box>
            </Box>
            
            <Box flex flexDirection={'row'}>
                <Box flexGrow={0} marginRight={15}>
                    <BasePropertyComponent
                        where="show"
                        property={resource.properties.derivativesValue}
                        resource={resource}
                        record={record}
                    />
                </Box>
                <Box flexGrow={0} alignSelf='auto'>
                    <Text>Allocation</Text>
                    <Text style={{marginTop:5}}>{`${derivativesAllocation}%`}</Text>
                </Box>
            </Box>
            
            <Box flex flexDirection={'row'}>
                <Box flexGrow={0} marginRight={15}>
                    <BasePropertyComponent
                        where="show"
                        property={resource.properties.bondsValue}
                        resource={resource}
                        record={record}
                    />
                </Box>
                <Box flexGrow={0} alignSelf='auto'>
                    <Text>Allocation</Text>
                    <Text style={{marginTop:5}}>{`${bondsAllocation}%`}</Text>
                </Box>
            </Box>
            
            <Box flex flexDirection={'row'}>
                <Box flexGrow={0} marginRight={15}>
                    <BasePropertyComponent
                        where="show"
                        property={resource.properties.alternativesValue}
                        resource={resource}
                        record={record}
                    />
                </Box>
                <Box flexGrow={0} alignSelf='auto'>
                    <Text>Allocation</Text>
                    <Text style={{marginTop:5}}>{`${alternativesAllocation}%`}</Text>
                </Box>
            </Box>

            <Box flex flexDirection={'row'}>
                <BasePropertyComponent
                    where="show"
                    property={resource.properties.status}
                    resource={resource}
                    record={record}
                />
            </Box>

            <Box flex flexDirection={'row'}>
                <BasePropertyComponent
                    where="show"
                    property={resource.properties.alert}
                    resource={resource}
                    record={record}
                />
            </Box>

            <Box marginY={10}>
                <Text>{`Total: ${total}`}</Text>
            </Box>
        </Box>
    </Box>
    </>)
}

export default CustodianStatementShow