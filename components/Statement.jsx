import { Box, Button, Text } from '@adminjs/design-system'
import { useRecord, BasePropertyComponent, useTranslation } from 'adminjs'
import { useHistory } from 'react-router'
import { useDropzone } from 'react-dropzone'
import PartySelect from './PartySelect'
import { appendForceRefresh } from '../utils/append-force-refresh'
import MixedArrayPropertyComponent from './MixedArrayPropertyComponent'

const Statement = (props) => {
    let { record: initialRecord, resource, action } = props
    const [docURL, setDocURL] = React.useState([])
    const onDrop = React.useCallback(acceptedFiles => {
        setDocURL(URL.createObjectURL(acceptedFiles[0]))
    }, [])
    const {getRootProps, getInputProps} = useDropzone({onDrop})
    const { record, handleChange, submit: handleSubmit } = useRecord(initialRecord, resource.id)
    const { translateButton } = useTranslation()
    const history = useHistory()
    const [detailsResource, setDetailsResource] = React.useState(resource.properties.details)

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

    React.useEffect(() => {
        setDetailsResource({...detailsResource, subProperties: detailsResource.subProperties.slice(0,2)})
    },[])
    
    return (
    <>
    <Box flex flexDirection={'row'}>
        <Box>
            <div {...getRootProps()} style={{borderWidth: 5}}>
                <input {...getInputProps()} style={{borderWidth: 5}} />
            </div>
            <iframe width={800} height={900} src={docURL} type="application/pdf"/>
        </Box>
        <div style={{ height: 1000, maxHeight: 1000, width: 800, maxWidth: 800, overflowY: 'scroll' }}>
            <Box py='lg' marginX={25} as='form' onSubmit={submit}>
                <BasePropertyComponent
                    where="edit"
                    onChange={handleChange}
                    property={resource.properties.name}
                    resource={resource}
                    record={record}
                    mb={0}
                />
                <BasePropertyComponent
                    where="edit"
                    onChange={handleChange}
                    property={resource.properties.type}
                    resource={resource}
                    record={record}
                    mb={0}
                />
                <BasePropertyComponent
                    where="edit"
                    onChange={handleChange}
                    property={resource.properties.currency}
                    resource={resource}
                    record={record}
                    mb={0}
                />
                <PartySelect
                    type='Custodian'
                    onChange={handleChange}
                    property={resource.properties.custodian}
                    resource={resource}
                    record={record}
                />
                <MixedArrayPropertyComponent
                    where="edit"
                    onChange={handleChange}
                    property={detailsResource}
                    resource={resource}
                    record={record}
                />
                <Box flex alignItems={'center'} justifyContent={'center'}>
                    <Button marginY={10} variant="primary" size="lg">
                        {translateButton('save', resource.id)}
                    </Button>
                </Box>
            </Box>
        </div>
    </Box>
    </>)
}

export default Statement