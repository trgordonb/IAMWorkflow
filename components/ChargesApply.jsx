import React, { useState } from 'react';
import { ApiClient } from 'adminjs'
import axios from 'axios'
import { Modal, Box, Button, Input } from '@adminjs/design-system';

const ChargesApply = () => {
    const api = new ApiClient()
    const [showModal, setShowModal] = useState(false)
    const [tag, setTag] = useState('')

    const doApply = async () => {
        let page = 0
        let totalPage = 0
        let sourceResults = []
        do {
            page = page + 1
            const results = await axios.get(`${api.baseURL}/api/resources/Statement/actions/list?filters.tag=${tag}&&page=${page}`)
            sourceResults.push(...results.data.records)
            totalPage = Math.ceil(results.data.meta.total / 10)
        } while (page < totalPage)
        await Promise.all(sourceResults.map(async (item) => {
            let newStatementItems = []
            let record = item.params
            let flattenItemsKeys = Object.keys(record).filter(key => {return key.startsWith('statementitems')})
            let statementItem = {}
            let index = 0
            if (record.status === 'DetailsMatched') {
                flattenItemsKeys.forEach((itemKey) => {
                    let itemList = itemKey.split('.')
                    let curIndex = parseInt(itemList[1])
                    if (curIndex === index) {
                        if (itemList[2] !== '_id') {
                            statementItem[itemList[2]] = record[itemKey]
                        }
                    } else {
                        let totalcharges = record.bankcharges
                        let grossamount = record.grossamount
                        let bankcharge = Math.round(totalcharges * (statementItem.grossamount / grossamount) * 100)/100
                        statementItem.netamount = statementItem.grossamount - bankcharge
                        newStatementItems.push(statementItem)
                        index = index + 1
                        statementItem = {}
                        if (itemList[2] !== '_id') {
                            statementItem[itemList[2]] = record[itemKey]
                        }
                    }
                })
                let totalcharges = record.bankcharges
                let grossamount = record.grossamount
                let bankcharge = Math.round(totalcharges * (statementItem.grossamount / grossamount) * 100)/100
                statementItem.netamount = statementItem.grossamount - bankcharge
                newStatementItems.push(statementItem)
                api.recordAction({
                    resourceId: 'Statement',
                    recordId: record._id,
                    actionName: 'edit',
                    data: {
                        statementitems: newStatementItems,
                        status: record.status,
                        isLocked: true
                    }
                })
            }
        })) 
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
            <Button style={{marginRight: 20}} onClick={doApply}>Apply charges to items</Button>
      </Box>
      
      {
        showModal &&
        <Modal
            title='Apply charges'
            onOverlayClick={()=> setShowModal(false)}
            variant='success'
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
