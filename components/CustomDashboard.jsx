import { Box, H4, H5, Button, Section } from '@adminjs/design-system'
import React from 'react'

const CustomDashboard = () => {
  return (
    <Box variant="grey">
      <Box variant="white">
          <H4>Assetonchain Technology Ltd I-AMS</H4>
          <img src='https://oh-estore.s3.amazonaws.com/AOCLogo.png' />
      </Box>
      <Box style={{marginTop:10}} variant="white">
          <H5>Apply bank charges to statement items</H5>
      </Box>
    </Box>
  )
}

export default CustomDashboard
