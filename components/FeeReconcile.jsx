import React, { useState } from 'react';
import { ApiClient } from 'adminjs'
import { Modal, Box, Button, Input } from '@adminjs/design-system';

const FeeReconcile = () => {
    const api = new ApiClient()
    const [showModal, setShowModal] = useState(false)
    const [errorAccounts, setErrorAccounts] = useState([])
    const [isSuccess, setIsSuccess] = useState(true)
    const [tag, setTag] = useState('')

    const doReconcile = async () => {
        const result = await api.resourceAction({
            resourceId: 'Statement',
            actionName: 'reconcile',
            data: {
                tag: tag,
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

    return (
    <Box
      margin="auto"
      maxWidth={600}
      display="flex"
      justifyContent="center"
      flexDirection="column"
    >
      <Box display="flex" justifyContent="center" m={10}>
            <Input
                style={{marginRight: 20}}
                value={tag}
                placeholder='tag'
                onChange={(evt) => setTag(evt.target.value)}
            />
            <Button style={{marginRight: 20}} onClick={doReconcile}>Reconcile with statements</Button>
      </Box>
      
      {
        showModal &&
        <Modal
            title='Fees Reconcilation with Statements'
            subTitle={isSuccess ? 'Successful': `The following policy numbers fail to reconcile with statements: ${errorAccounts.join(',')}`}
            onOverlayClick={()=> setShowModal(false)}
            variant= {isSuccess ? 'success': 'danger'}
            buttons={[{
                label: 'OK',
                onClick: () => setShowModal(false)
            }]}
        />
      }
    </Box>
  );
};

export default FeeReconcile
