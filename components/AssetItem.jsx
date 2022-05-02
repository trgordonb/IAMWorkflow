import React from 'react'
import { useRecord, BasePropertyComponent } from 'adminjs'

const AssetItem = (props) => {
    const { property, resource, record, onChange } = props
    console.log(props)

    return (
        <BasePropertyComponent          
            {...props}
        />
    )
}

export default AssetItem