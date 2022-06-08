import { Box, H4 } from '@adminjs/design-system'
import React, { useState } from 'react'
import { useRecord, BasePropertyComponent, ApiClient } from 'adminjs'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2'
import moment from 'moment'

ChartJS.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend)
const options = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: '',
      },
    },
};
  
const Dashboard = (props) => {
    const { record: initialRecord, resource, action } = props
    const { record, handleChange, submit } = useRecord(initialRecord, resource.id)
    const api = new ApiClient()
    const [graphData, setGraphData] = useState({})
    const [showGraph, setShowGraph] = useState(false)

    const customChange = async (propertyRecord, value, selectedRecord) => {
        const result = await api.resourceAction({
            resourceId: resource.id,
            actionName: 'list',
            data: {}
        })
        let records = result.data.records
        let rawData = records.filter(record => {return record.params.custodianAccount === selectedRecord.id}).map(item => item.params)
        const labels = rawData.map(item => moment(item.statementDate).format('YYYY-MM-DD'))
        const data = {
            labels,
            datasets: [
                {
                    label: 'Cash',
                    data: rawData.map(item => item.cashValue),
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    label: 'Equities',
                    data: rawData.map(item => item.equitiesValue),
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
                {
                    label: 'Bonds',
                    data: rawData.map(item => item.bondsValue),
                    backgroundColor: 'rgb(75, 192, 192, 0.5)',
                }
            ]
        }
        setGraphData(data)
        setShowGraph(true)
        handleChange(propertyRecord, value, selectedRecord)
    }

    return (
        <Box variant="grey">
            <Box py='lg' marginX={25} as="form">
                <Box flex flexDirection={'row'}>
                    <Box flexGrow={0} marginRight={5}>
                        <BasePropertyComponent
                            where="edit"
                            onChange={customChange}
                            property={resource.properties.custodianAccount}
                            resource={resource}
                            record={record}
                        />
                    </Box>
                </Box>
            </Box>
            <Box variant="white">
                <H4>Custodian Account AUM analysis</H4>
                {
                    showGraph &&
                    <Bar options={options} data={graphData} />
                }
            </Box>
        </Box>
    )
}

export default Dashboard