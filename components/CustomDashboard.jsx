import { Box, H4, H5, Button, Section, Input } from '@adminjs/design-system'
import React, { useState } from 'react'

const CustomDashboard = () => {
  const [tagBC, setTagBC] = useState('')
  const [tagFS, setTagFS] = useState('')
  const [bStatement, setBStatement] = useState('')
  const [tagDN, setTagDN] = useState('')

  return (
    <Box variant="grey">
      <Box variant="white">
          <H4>Assetonchain Technology Ltd I-AMS</H4>
          <img src='https://oh-estore.s3.amazonaws.com/AOCLogo.png' />
      </Box>
      <Box style={{marginTop:10}} display="flex" m={10} variant="white">
          <H5>Reconcile bank statement amounts with custodian statements</H5>
          <Input
            style={{marginLeft: 20, marginRight: 20}}
            value={bStatement}
            placeholder='Bank statement reference'
            onChange={(evt) => setBStatement(evt.target.value)}
          />
          <Button>Proceed</Button>
      </Box>
      <Box style={{marginTop:10}} display="flex" m={10} variant="white">
          <H5>Apply bank charges to statement items</H5>
          <Input
            style={{marginLeft: 20, marginRight: 20}}
            value={tagBC}
            placeholder='tag'
            onChange={(evt) => setTagBC(evt.target.value)}
          />
          <Button>Proceed</Button>
      </Box>
      <Box style={{marginTop:10}} display="flex" m={10} variant="white">
          <H5>Calculate fee shares</H5>
          <Input
            style={{marginLeft: 20, marginRight: 20}}
            value={tagFS}
            placeholder='tag'
            onChange={(evt) => setTagFS(evt.target.value)}
          />
          <Button>Proceed</Button>
      </Box>
      <Box style={{marginTop:10}} display="flex" m={10} variant="white">
          <H5>Reconcile custodian statements with demand notes</H5>
          <Input
            style={{marginLeft: 20, marginRight: 20}}
            value={tagDN}
            placeholder='tag'
            onChange={(evt) => setTagDN(evt.target.value)}
          />
          <Button>Proceed</Button>
      </Box>
    </Box>
  )
}

export default CustomDashboard
