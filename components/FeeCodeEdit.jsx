import { Box, Button, Text } from '@adminjs/design-system'
import { Edit } from '../node_modules/adminjs/src/frontend/components/actions/edit'
import { ApiClient, ActionHeader } from 'adminjs'

const FeeCodeEdit = (props) => {
    const { resource, action, record } = props
    const api = new ApiClient()
    const [isValid, setIsValid] = React.useState(true)
    React.useEffect(() => {
        const callValidate = async () => {
            const result = await api.resourceAction({
                resourceId: 'FeeCode',
                actionName: 'validate',
                data: {
                    id: record.id
                }
            })
            if (result.data) {
                setIsValid(result.data.validate)
            }
        }
        callValidate()
    },[])

    return (
    <Box>
        { isValid ? 
            <Edit
                action={action}
                resource={resource}
                record={record}
            /> :
            <Box px='lg' mt='xxl'>
                <ActionHeader
                    action={action}
                    resource={resource}
                    record={record}
                />
                <Text mt='xxl'>This record has already been used to calculate fees. Edit disallowed.</Text>
            </Box>
        }
    </Box>)
}

export default FeeCodeEdit