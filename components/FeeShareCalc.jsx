import React, { useState } from 'react';
import { ApiClient } from 'adminjs'
import { Modal, Box, Button, Input } from '@adminjs/design-system';

const FeeSharesCalc = () => {
    const api = new ApiClient()
    const [showModal, setShowModal] = useState(false)
    const [isSuccess, setIsSuccess] = useState(true)
    const [tag, setTag] = useState('')

    const calc = async () => {
        const result = await api.resourceAction({
            resourceId: 'Statement',
            actionName: 'feesharescalc',
            data: {
                tag: tag,
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
            <Button style={{marginRight: 20}} onClick={calc}>Calculate Fee Shares</Button>
      </Box>
      
      {
        showModal &&
        <Modal
            title='Fee Shares Allocation'
            onOverlayClick={()=> setShowModal(false)}
            variant={isSuccess ? 'success': 'danger'}
            subTitle={isSuccess ? 'Fee shares allocation success': 'Fee shares allocation fail'}
            buttons={[{
                label: 'OK',
                onClick: () => setShowModal(false)
            }]}
        />
      }
    </Box>
  );
};

export default FeeSharesCalc
