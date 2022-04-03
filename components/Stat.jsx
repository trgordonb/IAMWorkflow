import { Box, H6 } from '@adminjs/design-system'
import React, { useState } from 'react'

const Stat = (props) => {
    console.log(props)
    const [alertCount, setAlertCount] = useState(0)

    return (
        <Box style={{marginTop:10}} display="flex" variant="grqy">
            <H6>{`Asset Allocation records Portfolio value alert count: ${alertCount}`}</H6>
        </Box>
    )
}

export default Stat
