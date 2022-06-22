import React, { useEffect } from 'react'
import { Box, Pagination, Text } from '@adminjs/design-system'
import { useHistory, useLocation } from 'react-router'
import { RecordsTable, useRecords, useSelectedRecords} from 'adminjs'

const REFRESH_KEY = 'refresh'

const CustodianStatementList = (props) => {
    let { resource, setTag } = props
    if (resource.listProperties.length === 8) {
        let tmpListProperty1 = {
            ...resource.listProperties[7],
            label: 'Bond',
            name: 'bondsValue',
            propertyPath: 'bondsValue',
            position: 9
        }
        let tmpListProperty2 = {
            ...resource.listProperties[7],
            label: 'Alternative',
            name: 'alternativesValue',
            propertyPath: 'alternativesValue',
            position: 10
        }
        resource.listProperties.push(tmpListProperty1)
        resource.listProperties.push(tmpListProperty2)
    }
    const {
        records,
        loading,
        direction,
        sortBy,
        page,
        total,
        fetchData,
        perPage,
    } = useRecords(resource.id)
    const {
        selectedRecords,
        handleSelect,
        handleSelectAll,
        setSelectedRecords,
    } = useSelectedRecords(records)
    const location = useLocation()
    const history = useHistory()

    useEffect(() => {
        if (setTag) {
          setTag(total.toString())
        }
    }, [total])

    useEffect(() => {
        setSelectedRecords([])
    }, [resource.id])

    useEffect(() => {
        const search = new URLSearchParams(location.search)
        if (search.get(REFRESH_KEY)) {
          setSelectedRecords([])
        }
    }, [location.search])

    useEffect(() => {
        let tmpRecords = records
        tmpRecords.forEach(item => {
            item.params.total = item.params.total.toLocaleString()
            item.params.cashValue = item.params.cashValue.toLocaleString()
            item.params.bondsValue = item.params.bondsValue.toLocaleString()
            item.params.equitiesValue = item.params.equitiesValue.toLocaleString()
            item.params.derivativesValue = item.params.derivativesValue.toLocaleString()
            item.params.alternativesValue = item.params.alternativesValue.toLocaleString()
        })
    },[records])

    const handleActionPerformed = () => fetchData()
    const handlePaginationChange = (pageNumber) => {
        const search = new URLSearchParams(location.search)
        search.set('page', pageNumber.toString())
        history.push({ search: search.toString() })
    }

    return (
    <Box variant='white'>
        <RecordsTable
            resource={resource}
            records={records}
            actionPerformed={handleActionPerformed}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
            selectedRecords={selectedRecords}
            direction={direction}
            sortBy={sortBy}
            isLoading={loading}
        />
        <Text mt="xl" textAlign="center">
            <Pagination
                page={page}
                perPage={perPage}
                total={total}
                onChange={handlePaginationChange}
            />
        </Text>
    </Box>
    )
}

export default CustodianStatementList