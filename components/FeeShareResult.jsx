import React, { useEffect } from 'react'
import { Box, Pagination, Text } from '@adminjs/design-system'
import { useHistory, useLocation } from 'react-router'
import { RecordsTable, useRecords, useSelectedRecords} from 'adminjs'

const REFRESH_KEY = 'refresh'

const FeeShareResultList = (props) => {
    let { resource, setTag } = props
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
            item.params.amount = item.params.amount.toLocaleString()
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

export default FeeShareResultList