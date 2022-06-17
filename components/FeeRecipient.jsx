import { Box, Button, Text, DrawerFooter, DrawerContent } from '@adminjs/design-system'
import { useRecord, BasePropertyComponent, useTranslation, useNotice, ActionHeader } from 'adminjs'
import { useHistory } from 'react-router'

const FeeRecipient = (props) => {
    const { record: initialRecord, resource, action } = props
    console.log(props)
    const { record, handleChange, submit } = useRecord(initialRecord, resource.id)
    const history = useHistory()
    const { translateButton } = useTranslation()
    const sendNotice = useNotice()
    const [isCompany, setIsCompany] = React.useState(false)
    const [companyVisible, setCompanyVisible] = React.useState()
    const [entityVisible, setEntityVisible] = React.useState()
    const [name, setName] = React.useState('')

    const handleSubmit = event => {
        record.params.name = name
        submit().then(response => {
            history.push('/admin/resources/FeeRecipient')
        })
        return true
    }

    const customChange = async (propertyRecord, value, selectedRecord) => {
        if (propertyRecord === 'isCompany' && value) {
            setIsCompany(true)
        } else if (propertyRecord === 'isCompany' && !value) {
            setIsCompany(false)
        }
        if (propertyRecord === 'company' || propertyRecord === 'entity') {
            setName(selectedRecord.title)
        }
        handleChange(propertyRecord, value, selectedRecord)
    }

    React.useEffect(() => {
        if (isCompany) {
            setCompanyVisible(true)
            setEntityVisible(false)
        } else {
            setCompanyVisible(false)
            setEntityVisible(true)
        }
    },[isCompany])
    
    return (
        <Box py='lg' marginX={25} flex flexGrow={1} flexDirection="column" as="form" onSubmit={handleSubmit}>
            <DrawerContent>
            {
                action.name === 'edit' ? 
                <ActionHeader
                    action={action}
                    resource={resource}
                    record={record}
                /> :
                <ActionHeader
                    action={action}
                    resource={resource}
                />
            }
            
            <BasePropertyComponent
                where="edit"
                onChange={customChange}
                property={resource.properties.isCompany}
                resource={resource}
                record={record}
            />
            {   
                companyVisible &&   
                <Box>       
                    <BasePropertyComponent
                        where="edit"
                        onChange={customChange}
                        property={resource.properties.company}
                        resource={resource}
                        record={record}
                    />
                </Box> 
            }
            {   
                entityVisible &&
                <Box>
                    <BasePropertyComponent
                        where="edit"
                        onChange={customChange}
                        property={resource.properties.entity}
                        resource={resource}
                        record={record}
                    />
                </Box>
            }
            
        </DrawerContent>
        <DrawerFooter>
            <Button variant="primary" size="lg" type="submit">               
                {translateButton('save', resource.id)}
            </Button>
        </DrawerFooter>
    </Box>)
}

export default FeeRecipient