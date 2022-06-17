import { Box, Button, Text } from '@adminjs/design-system'
import { New } from '../node_modules/adminjs/src/frontend/components/actions/new'
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components'

const Wrapper = styled(Box)`
  max-height: 900px;
`

const Statement = (props) => {
    const { resource, action, record } = props
    const [docURL, setDocURL] = React.useState([])
    const onDrop = React.useCallback(acceptedFiles => {
        setDocURL(URL.createObjectURL(acceptedFiles[0]))
    }, [])
    const {getRootProps, getInputProps} = useDropzone({onDrop})

    return (
    <>
    <Box flex flexDirection={'row'}>
        <Box>
            <div {...getRootProps()} style={{borderWidth: 5}}>
                <input {...getInputProps()} style={{borderWidth: 5}} />
            </div>
            <iframe width={1000} height={900} src={docURL} type="application/pdf"/>
        </Box>
        <div style={{ height: 1000, maxHeight: 1000, width: 500, maxWidth: 500, overflowY: 'scroll' }}>
            <New
                action={action}
                resource={resource}
                record={record}
            />
        </div>
    </Box>
    </>)
}

export default Statement