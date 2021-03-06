import React, { useState } from 'react'
import { useNotice } from 'adminjs'
import { Box, Button } from '@adminjs/design-system';
import { saveAs } from 'file-saver'
import format from 'date-fns/format'

const getExportedFileName = (extension) =>
  `export-${format(Date.now(), 'yyyy-MM-dd_HH-mm')}.${extension}`

const MiniExport = (props) => {
    const { record } = props
    const [isPDF, setIsPDF] = useState(false)
    const [pdfUrl, setPdfUrl] = useState([])
    const sendNotice = useNotice()
    const createPdf = () => {
        const blob = new Blob([record.params.pdfData], {type: 'application/pdf'})
        const docUrl = URL.createObjectURL(blob)
        setPdfUrl(docUrl)
    }

    const exportData = async (type) => {
        try{
            if (type === 'csv') {
                const blob = new Blob([record.params.csvData], { type: 'text/csv' })
                saveAs(blob, getExportedFileName('csv'))
                sendNotice({ message: 'Exported successfully', type: 'success' })   
            } else if (type === 'pdf') {
                setIsPDF(true)
                await createPdf()
                sendNotice({ message: 'Exported successfully', type: 'success' })   
            }
        } catch (e) {
            sendNotice({ message: e.message, type: 'error' })
        }
    }

    return (
        <Box justifyContent="center">
            <Box>
                {
                    JSON.parse(record.params.reportTypes).includes('csv') &&
                    <Button style={{marginBottom: 20, marginRight: 20}} onClick={() => exportData('csv')}>
                        {`Output to CSV file`}
                    </Button>
                }
                {
                    JSON.parse(record.params.reportTypes).includes('pdf') &&
                    <Button style={{marginBottom: 20}} onClick={() => exportData('pdf')}>
                        {`Output to PDF file`}
                    </Button>
                }      
            </Box>
            { isPDF && <iframe width={1200} height={800} src={pdfUrl} type="application/pdf"/>}
        </Box>
    )
}

export default MiniExport
