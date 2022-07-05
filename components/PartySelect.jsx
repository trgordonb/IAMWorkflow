import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { ApiClient, flat } from 'adminjs'
import { FormGroup, Label } from '@adminjs/design-system'

const PartySelect = (props) => {
    const api = new ApiClient()
    const { onChange, property, type, record } = props
    const value = record.params && record.params[property.propertyPath]
    const [allItems, setAllItems] = useState([])
    const [selectedParty, setSelectedParty] = useState(value)

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

    return (
        <FormGroup style={{width:510}}>
            <Label htmlFor={property.propertyPath}>{property.label}</Label>
            <Select
                value={selectedParty}
                options={allItems}
                onChange={(item) => {
                    setSelectedParty(item)
                    onChange(property.propertyPath, item.value)
                }}
                autosize={true}
                {...property.props}
            />
        </FormGroup>
    )
}

export default PartySelect