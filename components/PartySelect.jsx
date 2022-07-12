import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { ApiClient, flat } from 'adminjs'
import { FormGroup, Label } from '@adminjs/design-system'

const PartySelect = (props) => {
    const api = new ApiClient()
    const { onChange, property, type, record } = props
    const value = record.params && record.params[property.propertyPath]
    const [allItems, setAllItems] = useState([])
    const [isReady, setIsReady] = useState(false)
    const [selectedParty, setSelectedParty] = useState({})

    useEffect(() => {
        const fetchParties= async() => {
            const result = await api.resourceAction({
                resourceId: 'Party',
                actionName: 'findbytype',
                data: {
                    type: type
                }
            })
            if (result.request && result.request.statusText === 'OK') {
                setAllItems(result.data.map(item => ({value: item._id, label: item.name})))
            }
        }
        fetchParties()
    }, [])

    useEffect(() => {
        if (allItems.length > 0) {
            const selectedItems = allItems.filter(item => {return item.value === value})
            if (selectedItems.length === 1) {
                setSelectedParty(selectedItems)
            }
        }
        setIsReady(true)
    },[allItems])

    return (
        <FormGroup style={{width:510}}>
            <Label htmlFor={property.propertyPath}>{property.label}</Label>
            { isReady && <Select
                value={selectedParty}
                options={allItems}
                onChange={(item) => {
                    setSelectedParty(item)
                    console.log(item)
                    onChange(property.propertyPath, item.value)
                }}
                autosize={true}
                {...property.props}
            /> }
        </FormGroup>
    )
}

export default PartySelect