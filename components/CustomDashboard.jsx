import { Box, H4, Button, Section, Input } from '@adminjs/design-system'
import React, { useState } from 'react'
import { ApiClient, useNotice } from 'adminjs'

const CustomDashboard = () => {
  const api = new ApiClient()
  const sendNotice = useNotice()
  const [tag1, setTag1] = useState('')
  const [tag2, setTag2] = useState('')
  const [tag3, setTag3] = useState('')
  return (
    <Box variant="grey">
      <Box variant="white">
          <H4>Tasks to be carried out: </H4>
          <Section style={{marginTop:15}}>
              <H4>Reconcilation of Settlement Bank Statements with Custodian Statements</H4>
              <Input 
                type='text' 
                value={tag1}
                id="t1" 
                placeholder="Enter your tag here"
                style={{marginRight: 15}}
                onChange={(event) => setTag1(event.target.value)}
              />
              <Button onClick={()=> sendNotice({message: 'Reconcilation success'})}>Proceed</Button>
          </Section>
          <Section style={{marginTop:15}}>
              <H4>Reconcilation of Settlement Bank Statements with Demand Notes</H4>
              <Input 
                type='text' 
                value={tag2}
                id="t2" 
                placeholder="Enter your tag here"
                style={{marginRight: 15}}
                onChange={(event) => setTag2(event.target.value)}
              />
              <Button onClick={()=> sendNotice({message: 'Reconcilation success'})}>Proceed</Button>
          </Section>
          <Section style={{marginTop:15}}>
              <H4>Reconcilation of Demand Notes with Custodian Statements</H4>
              <Input 
                type='text' 
                value={tag3}
                id="t3" 
                placeholder="Enter your tag here"
                style={{marginRight: 15}}
                onChange={(event) => setTag3(event.target.value)}
              />
              <Button onClick={()=> sendNotice({message: 'Reconcilation success'})}>Proceed</Button>
          </Section>
      </Box>
    </Box>
  )
}

export default CustomDashboard
