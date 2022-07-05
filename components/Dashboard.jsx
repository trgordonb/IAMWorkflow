import { Box, H4, H2, H6, Button, FormGroup, Label } from '@adminjs/design-system'
import React, { useState, useEffect } from 'react'
import { ApiClient, useCurrentAdmin, flat } from 'adminjs'
import Select from 'react-select'
import Modal from 'react-modal'

const Dashboard = (data) => {
    const api = new ApiClient()
    const [showPopup, setShowPopup] = useState(false)
    const [pdfUrl, setPdfUrl] = useState('')
    const customStyles = {
        content: {
          top: 100,
          left: 400,
        },
    }

    useEffect(() => {
        
    },[])

    const allReports = [{
        value: 'perf', label: 'Client Perfomance Report'
    }]
    const [selectedReport, setSelectedReport] = useState()
    const getReportData = async () => {
        const result = await api.resourceAction({
            resourceId: 'Report',
            actionName: 'genreport',
            data: {}
        })
        const actionRecord = flat.get(result.data.record.params)
        if (actionRecord.pdfData) {
            const blob = new Blob([result.data.record.params.pdfData], {type: 'application/pdf'})
            const docUrl = URL.createObjectURL(blob)
            setPdfUrl(docUrl)
        }
    }

    return (
        <Box variant="grey" flex flexDirection={'row'}>
            <Modal
                isOpen={showPopup}
                onRequestClose={() => setShowPopup(false)}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <iframe width={1380} height={750} src={pdfUrl} type="application/pdf"/>
            </Modal>
            <Box variant="white">
                <H2>I-AMS</H2>
                <H6>powered by AssetOnChain Technology</H6>
                <img src='https://iamlegacy.s3.ap-northeast-2.amazonaws.com/IAMLogo.jpg' />
            </Box>
            <Box variant="grey">
                <H2>Report Dashboard</H2>
                <FormGroup style={{width:500}}>
                    <Label>Available Reports</Label>
                    <Select
                        value={selectedReport}
                        options={allReports}
                        onChange={(item) => {
                            setSelectedReport(item)
                        }}
                        autosize={true}
                    />
                </FormGroup>
                <Button onClick={async () => {
                    await getReportData()
                    setShowPopup(true)
                }}>Show</Button>
            </Box>
        </Box>
    )
}

export default Dashboard
