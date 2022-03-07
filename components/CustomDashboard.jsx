import { Box, H4, H5, Button, Section } from '@adminjs/design-system'
import React, { useState, useEffect } from 'react'
import { ApiClient, useNotice } from 'adminjs'
import axios from 'axios'
import { parse } from 'json2csv'

const CustomDashboard = () => {
  const api = new ApiClient()
  const sendNotice = useNotice()
  const [tasks, setTasks] = useState([])
  
  const taskHandler = async (task) => {
    let page = 0
    let totalPage = 0
    let sourceResults = []
    let targetResults = []
    let sourceData = []
    let targetData = []
    let unmatched = []
    let matched = []
    let success = true
    let failReason = ''
    do {
      page = page + 1
      const results = await axios.get(`${api.baseURL}/api/resources/${task['source.name']}/actions/list?filters.tag=${task.tag}&&page=${page}`)
      sourceResults.push(...results.data.records)
      totalPage = Math.ceil(results.data.meta.total / 10)
    } while (page < totalPage)
    //console.log(sourceResults)
    sourceResults = sourceResults.map(record => [record.params, record.populated])
    sourceResults.forEach((result) => {
      if (result[0].hasOwnProperty(task['source.field']) && result[0].hasOwnProperty(task['matcheOn']) && success) {
        sourceData.push({
          _id: result[0]._id,
          [task['source.field']]: result[0][task['source.field']],
          [task['matcheOn']]: result[1][task['matcheOn']].params.number
        })
      } else {
        success == false
        failReason = "Source table does not have the required field"
      }
    })
    if (success) {
      page = 0
      totalPage = 0
      do {
        page = page + 1
        const results = await axios.get(`${api.baseURL}/api/resources/${task['target.name']}/actions/list?filters.tag=${task.tag}&&page=${page}`)
        targetResults.push(...results.data.records)
        totalPage = Math.ceil(results.data.meta.total / 10)
      } while (page < totalPage)
      targetResults = targetResults.map(record => [record.params, record.populated])
      targetResults.forEach(result => {
        if (result[0].hasOwnProperty(task['target.field']) && result[0].hasOwnProperty(task['matcheOn']) && success) {
          targetData.push({
            _id: result[0]._id,
            [task['target.field']]: result[0][task['target.field']],
            [task['matcheOn']]: result[1][task['matcheOn']].params.number //TO FIX LATER
          })
        } else {
          success == false
          failReason = "Target table does not have the required field"
        }
      })
    }
    
    if (task.relationship === 'OneOnOne') {
      sourceData.forEach(record => {
        let matchKey = record[task['matcheOn']]
        let matchedRecord = targetData.find(obj => obj[task['matcheOn']] === matchKey)
        if (!matchedRecord) {
          unmatched.push({
            source: record,
            target: undefined
          })
        } else {
          if (matchedRecord[task['target.field']] !== record[task['source.field']]) {
            unmatched.push({
              source: record,
              target: matchedRecord
            })
          } else {
            matched.push({
              source: record,
              target: matchedRecord
            })
          }
        }
      })
    }
    let reconcileDetails = []
    reconcileDetails = unmatched.map(item => ({
      status: 'Unmatched',
      source: {
        name: task['source.name'],
        id: item.source._id,
      },
      target: { 
        name: task['target.name'],
        id: item.target ? item.target._id : ''
      }
    }))
    reconcileDetails.push(...matched.map(item => ({
      status: 'Matched',
      source: {
        name: task['source.name'],
        id: item.source._id,
      },
      target: { 
        name: task['target.name'],
        id: item.target._id
      }
    })))
    if (unmatched.length > 0) {
      let unmatchedCSV = parse(unmatched.map((item) => {
        return {
          [task['matcheOn']] : item.source[task['matcheOn']],
          [`Source: ${task['source.field']}`] : item.source[task['source.field']],
          [`Target: ${task['target.field']}`] : item.target ? item.target[task['target.field']] : '-'
        }
      }))
      const blob = new Blob([unmatchedCSV], { type: 'text/csv' })
      saveAs(blob, 'unmatched.csv')
      sendNotice({message: 'Reconcilation fail, see the discrepencies at the downloaded CSV file', type:'error'})  
      const apiResult = await api.recordAction({
        recordId: task._id,
        resourceId: 'Task',
        actionName: 'edit',
        data: {
          lastRunStatus: 'Unmatched',
          lastRunTime: new Date(),
          lastRunDetails: reconcileDetails
        }
      })
    } else {
      if (success) {
        //update success reconcile status to backend
        const apiResult = await api.recordAction({
          recordId: task._id,
          resourceId: 'Task',
          actionName: 'edit',
          data: {
            lastRunStatus: 'Matched',
            lastRunTime: new Date(),
            lastRunDetails: reconcileDetails
          }
        })
        sendNotice({message: 'Reconcilation success'})
      } else {
        //update fail reconcile status to backend
        const apiResult = await api.recordAction({
          recordId: task._id,
          resourceId: 'Task',
          actionName: 'edit',
          data: {
            lastRunStatus: 'Unmatched',
            lastRunTime: new Date(),
            lastRunDetails: []
          }
        })
        sendNotice({message: failReason, type: 'error'})
      }
    }
  }

  useEffect(() => {
    api.resourceAction({
      resourceId: 'Task',
      actionName: 'list'
    })
    .then(result => {
      setTasks(result.data.records)
    })
  },[])

  return (
    <Box variant="grey">
      <Box variant="white">
          <H4>Tasks to be carried out: </H4>
          {
            tasks.map(task => (
              <Section key={task.params.name} style={{ marginTop: 15 }}>
                <H5>{task.params.name}</H5>
                <Button onClick={() => taskHandler(task.params)}>Proceed</Button>
              </Section>
            ))
          }
      </Box>
    </Box>
  )
}

export default CustomDashboard
