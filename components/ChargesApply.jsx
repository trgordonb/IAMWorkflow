import React, { useState } from 'react';
import { ApiClient } from 'adminjs'
import { Modal, Box, Button, Input } from '@adminjs/design-system';

const ChargesApply = () => {
    const api = new ApiClient()
    const [showModal, setShowModal] = useState(false)
    const [isSuccess, setIsSuccess] = useState(true)
    const [tag, setTag] = useState('')

    const doApplyCharges = async () => {
        const result = await api.resourceAction({
            resourceId: 'Statement',
            actionName: 'applycharges',
            data: {
                tag: tag,
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
            <Button style={{marginRight: 20}} onClick={doApplyCharges}>Apply charges to items</Button>
      </Box>
      
      {
        showModal &&
        <Modal
            title='Apply charges'
            subTitle={isSuccess ? 'Apply charges success': 'Apply charges fail'}
            onOverlayClick={()=> setShowModal(false)}
            variant={isSuccess ? 'success': 'danger'}
            buttons={[{
                label: 'OK',
                onClick: () => setShowModal(false)
            }]}
        />
      }
    </Box>
  );
};

export default ChargesApply
