import React, { useState } from 'react';
import { ApiClient } from 'adminjs'
import { Modal, Box, Button, Input } from '@adminjs/design-system';

const BankReconcile = () => {
    const api = new ApiClient()
    const [statementId, setStatementId] = useState('')
    const [isMatched, setIsMatched] = useState(true)
    const [unmatched, setUnmatched] = useState([])
    const [showModal, setShowModal] = useState(false)

    const doReconcile = async () => {
      const result = await api.resourceAction({
        resourceId: 'BankStatementItem',
        actionName: 'reconcile',
        data: {
            statementId: statementId,
            action: 'bankreconcile'
        }
      })
      if (result.data.notice.type === 'error') {
        setIsMatched(false)
      } else {
        setIsMatched(true)
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
                value={statementId}
                placeholder='Statement Id'
                onChange={(evt) => setStatementId(evt.target.value)}
            />
            <Button style={{marginRight: 20}} onClick={doReconcile}>Reconcile</Button>
      </Box>
      
      {
        showModal &&
        <Modal
            title={ isMatched ? "Statements match": "Statements mismatch" }
            onOverlayClick={()=> setShowModal(false)}
            variant={ isMatched ? 'success': 'danger'}
            subTitle={ isMatched ?  '' : 'Check these statements for discrepancies:\r\n' + `${unmatched.join(',')}`}
            buttons={[{
                label: 'OK',
                onClick: () => setShowModal(false)
            }]}
        />
      }
    </Box>
  );
};

export default BankReconcile;
