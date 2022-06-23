import { Box, Button, Text } from '@adminjs/design-system'
import { useRecord, BasePropertyComponent, useTranslation, useNotice } from 'adminjs'
import { useHistory } from 'react-router'
import { useDropzone } from 'react-dropzone'
import { flat } from 'adminjs'
import DateControl from './DateControl'
import { appendForceRefresh } from '../utils/append-force-refresh'
import PartySelect from './PartySelect'

const BankStatementItem = (props) => {
    const { record: initialRecord, resource } = props
    const [docURL, setDocURL] = React.useState([])
    const onDrop = React.useCallback(acceptedFiles => {
        setDocURL(URL.createObjectURL(acceptedFiles[0]))
    }, [])
    const {getRootProps, getInputProps} = useDropzone({onDrop})
    const { record, handleChange, submit: handleSubmit } = useRecord(initialRecord, resource.id)
    const history = useHistory()
    const { translateButton } = useTranslation()
    const initialGross = 0
    if (initialRecord && initialRecord.params && initialRecord.params.grossAmount) {
        initialGross = initialRecord.params.grossAmount
    }
    const [total, setTotal] = React.useState(initialGross)
    const [currency, setCurrency] = React.useState('')
    const sendNotice = useNotice()

    const submit = event => {
        event.preventDefault()
        let verifyOK = true
        if (record.params.currency !== currency) {
            verifyOK = false
            sendNotice({ message: 'Currency does not match with the choosen statement items', type: 'error' })
            return false
        }
        if (Math.abs(parseFloat(record.params.grossAmount) - total) > 0.00001) {
            verifyOK = false
            sendNotice({ message: 'Item amount does not match with the gross total of the selected statements', type: 'error' })
            return false
        }
        if (verifyOK) {
            handleSubmit().then(response => {
                if (response.data.redirectUrl) {
                    history.push(appendForceRefresh(response.data.redirectUrl))
                }
                if (response.data.record.id && !Object.keys(response.data.record.errors).length) {
                    handleChange({ params: {}, populated: {}, errors: {} })
                }
            })
            return false
        } else {
            return false
        }      
    }

    const customChange = async (propertyRecord, value, selectedRecord) => {
        if (selectedRecord && selectedRecord.params) {
            const record = flat.get(selectedRecord)
            if (propertyRecord === 'matchedStatement') {
                if (record.params.sum) {
                    setTotal(record.params.sum)
                }
            } else if (propertyRecord === 'currency') {
                setCurrency(record.params._id)
            }
        }
        handleChange(propertyRecord, value, selectedRecord)
    }

    return (
    <>
    <Box flex flexDirection={'row'}>
        <Box>
            <div {...getRootProps()} style={{borderWidth: 5}}>
                <input {...getInputProps()} style={{borderWidth: 5}} />
            </div>
            <iframe width={1000} height={800} src={docURL} type="application/pdf"/>
        </Box>
        <Box flexGrow={1} py='lg' marginX={25} as="form" onSubmit={submit}>          
            <DateControl
                onChange={handleChange}
                property={resource.properties.statementDate}
                resource={resource}
                record={record}
            />
            <PartySelect
                type='Bank'
                onChange={customChange}
                property={resource.properties.bank}
                resource={resource}
                record={record}
            />
            <BasePropertyComponent
                where="edit"
                onChange={handleChange}
                property={resource.properties.bankStatementRef}
                resource={resource}
                record={record}
            />
            <BasePropertyComponent
                where="edit"
                onChange={customChange}
                property={resource.properties.currency}
                resource={resource}
                record={record}
            />
            <PartySelect
                type='Company'
                onChange={customChange}
                property={resource.properties.companyAccount}
                resource={resource}
                record={record}
            />
            <PartySelect
                type='Custodian'
                onChange={customChange}
                property={resource.properties.counterParty}
                resource={resource}
                record={record}
            />
            <BasePropertyComponent
                where="edit"
                onChange={handleChange}
                property={resource.properties.grossAmount}
                resource={resource}
                record={record}
            />
            <BasePropertyComponent
                where="edit"
                onChange={handleChange}
                property={resource.properties.itemCharge}
                resource={resource}
                record={record}
            />
            <BasePropertyComponent
                where="edit"
                onChange={customChange}
                property={resource.properties.matchedStatement}
                resource={resource}
                record={record}
            />
            <Box marginBottom={20} alignSelf='auto'>
                <Text>{`Statement Item Amount: ${total}`}</Text>
            </Box>
            <BasePropertyComponent
                where="edit"
                onChange={handleChange}
                property={resource.properties.remark}
                resource={resource}
                record={record}
            />
            <Button variant="primary" size="lg">
                {translateButton('save', resource.id)}
            </Button>
        </Box>
    </Box>
    </>)
}

export default BankStatementItem