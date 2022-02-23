import { Box, H3, Button } from '@adminjs/design-system'
import React, { useEffect, useState } from 'react'
import { ApiClient } from 'adminjs'

const api = new ApiClient()

const CustomDashboard = () => {
  const generateView = () => {
    api.searchRecords({
      resourceId: 'AccountLedgerBalance',
      query: '?tag=2021Q4'
    })
    .then(response => {
      console.log(response)
    })
  }

  return (
    <Box variant="grey">
      <Box variant="white">
        <H3>Here you can specify a totally custom dashboard</H3>
        <Box>
          <Button onClick={()=>generateView()}>Generate 2021Q4 Management Fee Report</Button>
        </Box>
      </Box>
    </Box>
  )
}

export default CustomDashboard
