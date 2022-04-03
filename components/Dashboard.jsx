import { Box, H4, H5, H6, Button, DatePicker, Modal } from '@adminjs/design-system'
import React, { useState, useEffect } from 'react'
import { ApiClient, useCurrentAdmin } from 'adminjs'

const Dashboard = (data) => {
    const [currentAdmin, setCurrentAdmin] = useCurrentAdmin()
    const api = new ApiClient()
    const [alertCount, setAlertCount] = useState(0)
    const [lastDate, setLastDate] = useState()
    const [currentDate, setCurrentDate] = useState()
    const [showModal, setShowModal] = useState(false)
    const [isSuccess, setIsSuccess] = useState(true)

    const doUnitize = async () => {
        const result = await api.resourceAction({
            resourceId: 'CustomerUnitizedPerformance',
            actionName: 'calc',
            data: { lastDate, currentDate }
        })
        if (result.data.result.error) {
            setIsSuccess(false)
            setShowModal(true)
        } else {
            setIsSuccess(true)
            setShowModal(true)
        }
    }

    useEffect(() => {
        const getAAAlertCount = async () => {
            let results = await api.resourceAction({
                resourceId: 'AllAssetAllocation',
                actionName: 'stat'
            })
            if (results.data) {
                setAlertCount(results.data.data)
            }
        }
        getAAAlertCount()
    },[])

    return (
        <Box variant="grey">
            <Box variant="white">
                <H4>Assetonchain Technology Ltd I-AMS</H4>
                <img src='https://oh-estore.s3.amazonaws.com/AOCLogo.png' />
            </Box>
            {
                currentAdmin && currentAdmin.role !== 'reader' &&
                <Box style={{marginTop:10}} display="flex" variant="white">
                    <H5>{`Asset Allocation records Portfolio value alert count (threshold: 10%): ${alertCount}`}</H5>
                </Box>
            }
            {
                currentAdmin && currentAdmin.role !== 'reader' &&
                <Box style={{marginTop:10}} variant="white">
                    <H5 style={{marginRight:10}}>Calculate current month portfolio unitized performance</H5>
                    <H6>Last Period Date</H6>
                    <DatePicker
                        onChange={setLastDate}
                        value={lastDate}
                        propertyType='date'
                    />
                    <H6>Current Period Date</H6>
                    <DatePicker
                        onChange={setCurrentDate}
                        value={currentDate}
                        propertyType='date'
                    />
                    
                    <Button style={{marginTop: 10}} onClick={doUnitize}>Proceed</Button>
                </Box>
            }
            {
                showModal &&
                <Modal
                    title="Unitized Performance"
                    onOverlayClick={()=> setShowModal(false)}
                    variant={ isSuccess ? 'success': 'danger'}
                    subTitle={ isSuccess ? 'OK': 'Fail' }
                    buttons={[{
                        label: 'OK',
                        onClick: () => setShowModal(false)
                    }]}
                />
            }
        </Box>
    )
}

export default Dashboard
