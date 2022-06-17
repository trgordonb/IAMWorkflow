import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { ApiClient, useCurrentAdmin, flat } from 'adminjs'
import { FormGroup, Label } from '@adminjs/design-system'
import moment from 'moment'

const DateSelect = (props) => {
    const api = new ApiClient()
    const [currentAdmin, setCurrentAdmin] = useCurrentAdmin()
    const { value, onChange, property, record } = props
    const dayValue = record.params && record.params[property.propertyPath]
    const [selectedDate, setSelectedDate] = useState({
        value: dayValue,
        label: dayValue? moment(dayValue).format('YYYY-MM-DD'): ''
    })
    const [subPeriods, setSubPeriods] = useState([])
    const [allItems, setAllItems] = useState([])

    useEffect(() => {
        const fetchDates = async() => {
            if (subPeriods.length === 0) {
                const result = await api.recordAction({
                    resourceId: 'Period',
                    recordId: currentAdmin.period,
                    actionName: 'show'
                })
                if (result.request && result.request.statusText === 'OK') {
                    let subDates = flat.get(result.data.record.params).subPeriodEndDates
                    setAllItems(subDates.map(item => ({value: item, label: moment(item).format('YYYY-MM-DD')})))
                    setSubPeriods(subDates)
                }
            }
        }
        fetchDates()
    }, [])

    return (
        <FormGroup style={{width:200}}>
            <Label htmlFor={property.propertyPath}>{property.label}</Label>
            <Select
                value={selectedDate}
                options={allItems}
                onChange={(item) => {
                    setSelectedDate(item)
                    onChange(property.propertyPath, item.value)
                }}
                autosize={true}
                {...property.props}
            />
        </FormGroup>
    )
}

export default DateSelect