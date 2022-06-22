import { Box, Button, Text } from '@adminjs/design-system'
import { useRecord, BasePropertyComponent, useTranslation, ApiClient } from 'adminjs'
import { useHistory } from 'react-router'
import { useDropzone } from 'react-dropzone'
import DateSelect from './DateSelect'
import { appendForceRefresh } from '../utils/append-force-refresh'

const CustodianStatement = (props) => {
    const { record: initialRecord, resource, action } = props
    const [clientId, setClientId] = React.useState('')
    const [total, setTotal] = React.useState(0)
    const [cashAllocation, setCashAllocation] = React.useState(0)
    const [equitiesAllocation, setEquitiesAllocation] = React.useState(0)
    const [derivativesAllocation, setDerivativesAllocation] = React.useState(0)
    const [bondsAllocation, setBondsAllocation] = React.useState(0)
    const [alternativesAllocation, setAlternativesAllocation] = React.useState(0)
    let valuesList = []
    const [docURL, setDocURL] = React.useState([])
    const onDrop = React.useCallback(acceptedFiles => {
        setDocURL(URL.createObjectURL(acceptedFiles[0]))
    }, [])
    const {getRootProps, getInputProps} = useDropzone({onDrop})
    const allKeys = ['cashValue','equitiesValue','derivativesValue','bondsValue','alternativesValue']

    const { record, handleChange, submit: handleSubmit } = useRecord(initialRecord, resource.id)
    const history = useHistory()
    const api = new ApiClient()
    const { translateButton } = useTranslation()

    const submit = event => {
        event.preventDefault()
        handleSubmit().then((response) => {
            if (response.data.redirectUrl) {
                history.push(appendForceRefresh(response.data.redirectUrl))
            }
            if (response.data.record.id && !Object.keys(response.data.record.errors).length) {
                handleChange({ params: {}, populated: {}, errors: {} })
            }
        });
        return false;
    }

    const customChange = async (propertyRecord, value, selectedRecord) => {
        if (allKeys.indexOf(propertyRecord) >= 0 && value !== '') {
            valuesList.push({[propertyRecord]: value})
        }
        if (selectedRecord && selectedRecord.params && selectedRecord.params.customer) {
            const result = await api.recordAction({
                resourceId: 'Customer',
                recordId: selectedRecord.params.customer,
                actionName: 'show'
            })
            if (result && result.status === 200) {
                setClientId(result.data.record.params.clientId)
            }
        }
        handleChange(propertyRecord, value, selectedRecord)
    }


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
        Object.keys(record.params).filter(key => allKeys.indexOf(key) >= 0).forEach(key => {
            if (record.params[key] !== '') {
                curTotal = curTotal + parseFloat(record.params[key])
            }
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
        <Box py='lg' marginX={25} as="form" onSubmit={submit}>          
            <Box flex flexDirection={'row'}>
                <Box flexGrow={0} marginRight={15}>
                    <DateSelect
                        onChange={handleChange}
                        property={resource.properties.statementDate}
                        resource={resource}
                        record={record}
                    />        
                </Box>                   
            </Box>
            <Box flex flexDirection={'row'}>
                <Box flexGrow={1} marginRight={5}>
                    <BasePropertyComponent
                        where="edit"
                        onChange={customChange}
                        property={resource.properties.custodianAccount}
                        resource={resource}
                        record={record}
                    />
                </Box>
                <Box flexShrink={1} marginLeft={10} alignSelf='auto'>
                    <Text>Customer Id</Text>
                    <Text style={{marginTop:12}}>{clientId}</Text>
                </Box>
            </Box>
            <Box flex flexDirection={'row'}>
                <Box flexGrow={0} marginRight={15}>
                    <BasePropertyComponent
                        where="edit"
                        onChange={customChange}
                        property={resource.properties.cashValue}
                        resource={resource}
                        record={record}
                    />
                </Box>
                <Box flexGrow={0} alignSelf='auto'>
                    <Text>Allocation</Text>
                    <Text style={{marginTop:12}}>{`${cashAllocation}%`}</Text>
                </Box>
            </Box>
            
            <Box flex flexDirection={'row'}>
                <Box flexGrow={0} marginRight={15}>
                    <BasePropertyComponent
                        where="edit"
                        onChange={customChange}
                        property={resource.properties.equitiesValue}
                        resource={resource}
                        record={record}
                    />
                </Box>
                <Box flexGrow={0} alignSelf='auto'>
                    <Text>Allocation</Text>
                    <Text style={{marginTop:12}}>{`${equitiesAllocation}%`}</Text>
                </Box>
            </Box>
            
            <Box flex flexDirection={'row'}>
                <Box flexGrow={0} marginRight={15}>
                    <BasePropertyComponent
                        where="edit"
                        onChange={customChange}
                        property={resource.properties.derivativesValue}
                        resource={resource}
                        record={record}
                    />
                </Box>
                <Box flexGrow={0} alignSelf='auto'>
                    <Text>Allocation</Text>
                    <Text style={{marginTop:12}}>{`${derivativesAllocation}%`}</Text>
                </Box>
            </Box>
            
            <Box flex flexDirection={'row'}>
                <Box flexGrow={0} marginRight={15}>
                    <BasePropertyComponent
                        where="edit"
                        onChange={customChange}
                        property={resource.properties.bondsValue}
                        resource={resource}
                        record={record}
                    />
                </Box>
                <Box flexGrow={0} alignSelf='auto'>
                    <Text>Allocation</Text>
                    <Text style={{marginTop:12}}>{`${bondsAllocation}%`}</Text>
                </Box>
            </Box>
            
            <Box flex flexDirection={'row'}>
                <Box flexGrow={0} marginRight={15}>
                    <BasePropertyComponent
                        where="edit"
                        onChange={customChange}
                        property={resource.properties.alternativesValue}
                        resource={resource}
                        record={record}
                    />
                </Box>
                <Box flexGrow={0} alignSelf='auto'>
                    <Text>Allocation</Text>
                    <Text style={{marginTop:12}}>{`${alternativesAllocation}%`}</Text>
                </Box>
            </Box>

            <Box marginY={10}>
                <Text>{`Total: ${total}`}</Text>
            </Box>
            <Button variant="primary" size="lg">
                {translateButton('save', resource.id)}
            </Button>
        </Box>
    </Box>
    </>)
}

export default CustodianStatement