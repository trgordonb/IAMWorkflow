import { Box, H4, H5, Button, Modal, Input } from '@adminjs/design-system'
import React, { useState } from 'react'
import { ApiClient } from 'adminjs'

const CustomDashboard = () => {
  const api = new ApiClient()
  const [tagBC, setTagBC] = useState('')
  const [tagFS, setTagFS] = useState('')
  const [bStatement, setBStatement] = useState('')
  const [tagDN, setTagDN] = useState('')
  const [isSuccess, setIsSuccess] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [taskName, setTaskName] = useState('')

  const doBankReconcile = async () => {
    setTaskName('Bank Statement Reconcilation')
    const result = await api.resourceAction({
      resourceId: 'BankStatementItem',
      actionName: 'reconcile',
      data: {
          statementId: bStatement,
          action: 'bankreconcile'
      }
    })
    if (result.data.notice.type === 'error') {
      setIsSuccess(false)
    } else {
      setIsSuccess(true)
    }
    setShowModal(true)
  }

  const doApplyCharges = async () => {
    setTaskName('Apply bank charges to custodian statements')
    const result = await api.resourceAction({
        resourceId: 'Statement',
        actionName: 'applycharges',
        data: {
            tag: tagBC,
            action: 'applycharges'
        }
    })
    if (result.data.notice.type === 'error') {
      setIsSuccess(false)
    } else {
      setIsSuccess(true)
    }
    setShowModal(true)
  }

  const doReconcile = async () => {
    setTaskName('Reconcilation with demand notes')
    const result = await api.resourceAction({
        resourceId: 'Statement',
        actionName: 'reconcile',
        data: {
            tag: tagDN,
            action: 'reconcile'
        }
    })
    if (result.data.notice.type === 'error') {
      setIsSuccess(false)
      setErrorAccounts(result.data.notice.data)
    } else {
      setIsSuccess(true)
    }
    setShowModal(true)
  }

  const doCalc = async () => {
    setTaskName('Calculate fees shares')
    const result = await api.resourceAction({
        resourceId: 'Statement',
        actionName: 'feesharescalc',
        data: {
            tag: tagFS,
            action: 'feesharescalc'
        }
    })
    if (result.data.notice.type === 'error') {
      setIsSuccess(false)
    } else {
      setIsSuccess(true)
    }
    setShowModal(true)
  }

  return (
    <Box variant="grey">
      <Box variant="white">
          <H4>Assetonchain Technology Ltd I-AMS</H4>
          <img src='https://oh-estore.s3.amazonaws.com/AOCLogo.png' />
      </Box>
      <Box style={{marginTop:10}} display="flex" variant="white">
          <H5>Reconcile bank statement amounts with custodian statements</H5>
          <Input
            style={{marginLeft: 20, marginRight: 20}}
            value={bStatement}
            placeholder='Bank statement reference'
            onChange={(evt) => setBStatement(evt.target.value)}
          />
          <Button onClick={doBankReconcile}>Proceed</Button>
      </Box>
      <Box style={{marginTop:10}} display="flex" variant="white">
          <H5>Apply bank charges to statement items</H5>
          <Input
            style={{marginLeft: 20, marginRight: 20}}
            value={tagBC}
            placeholder='tag'
            onChange={(evt) => setTagBC(evt.target.value)}
          />
          <Button onClick={doApplyCharges}>Proceed</Button>
      </Box>
      <Box style={{marginTop:10}} display="flex" variant="white">
          <H5>Calculate fee shares</H5>
          <Input
            style={{marginLeft: 20, marginRight: 20}}
            value={tagFS}
            placeholder='tag'
            onChange={(evt) => setTagFS(evt.target.value)}
          />
          <Button onClick={doCalc}>Proceed</Button>
      </Box>
      <Box style={{marginTop:10}} display="flex" variant="white">
          <H5>Reconcile custodian statements with demand notes</H5>
          <Input
            style={{marginLeft: 20, marginRight: 20}}
            value={tagDN}
            placeholder='tag'
            onChange={(evt) => setTagDN(evt.target.value)}
          />
          <Button onClick={doReconcile}>Proceed</Button>
      </Box>
      {
        showModal &&
        <Modal
            title={taskName}
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

export default CustomDashboard
