import React, { useState } from 'react';
import { ApiClient } from 'adminjs'
import axios from 'axios'
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

    const reconcile = async () => {
        let page = 0
        let totalPage = 0
        let sourceResults = []
        do {
            page = page + 1
            const results = await axios.get(`${api.baseURL}/api/resources/BankStatementItem/actions/list?filters.bankstatementId=${statementId}&&page=${page}`)
            sourceResults.push(...results.data.records)
            totalPage = Math.ceil(results.data.meta.total / 10)
        } while (page < totalPage)
        let unmatched = []
        await Promise.all(sourceResults.map(async (item) => {
            const alreadyReconciled = item.populated.statement.params.bankStatementitem ? true: false
            if (!alreadyReconciled) {
              const sourcegrossamt = item.params.grossamount
              const targetgrossamt = item.populated.statement.params.grossamount
              if (item.params.currency !== item.populated.statement.params.currency) {
                    setIsMatched(false)
                    setUnmatched([...unmatched, item.populated.statement.params.reference])
              }
              else if (sourcegrossamt !== targetgrossamt ) {
                    setIsMatched(false)
                    setUnmatched([...unmatched, item.populated.statement.params.reference])
              } else {
                    await api.recordAction({
                      recordId: item.populated.statement.params._id,
                      resourceId: 'Statement',
                      actionName: 'edit',
                      data: {
                        bankcharges: item.params.bankcharges,
                        netamount: item.params.netamount,
                        bankStatementitem: item.params._id,
                        status: item.populated.statement.params.status
                      }
                    })
                    await api.recordAction({
                      recordId: item.params._id,
                      resourceId: 'BankStatementItem',
                      actionName: 'edit',
                      data: {
                        isLocked: true  //not sent ?
                      }
                    })
              }
            }
          }
        ))
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
