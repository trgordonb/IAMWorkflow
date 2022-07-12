import { Box, Button, H4 } from '@adminjs/design-system'
import { colors } from 'admin-bro-theme-dark';
import { useRecord, BasePropertyComponent, useTranslation, ApiClient } from 'adminjs'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import moment from 'moment';
import { Bar } from 'react-chartjs-2'

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

const UnitizedPerformance = (props) => {
    const { record: initialRecord, resource, action } = props    
    const { record, handleChange, submit } = useRecord(initialRecord, resource.id)
    const api = new ApiClient()
    const [graphData1, setGraphData1] = React.useState({})
    const [graphData2, setGraphData2] = React.useState({})
    const [showGraph, setShowGraph] = React.useState(false)
    
    React.useEffect(() => {
        const getData = async () => {
            const result = await api.resourceAction({
                resourceId: resource.id,
                actionName: 'list',
                data: {}
            })
            let records = result.data.records
            let filteredRecords = records.filter(item => {
                return (item.params.customer === record.params.customer)
            })
            const colors1 = filteredRecords.map((value) => value.params.netChange < 0 ? 'red' : 'green')
            const colors2 = filteredRecords.map((value) => value.params.unitizedChange < 0 ? 'red' : 'green')

            const labels = filteredRecords.map(item => moment(item.params.currentSubPeriodDate).format('YYYY-MM-DD'))
            const data1 = {
                labels,
                datasets: [
                    {
                        label: 'Net NAV Change',
                        borderColor: colors1,
                        backgroundColor: colors1,
                        data: filteredRecords.map(item => item.params.netChange)
                    },
                ]
            }
            const data2 = {
                labels,
                datasets: [
                    {
                        label: 'Unitized Change',
                        borderColor: colors2,
                        backgroundColor: colors2,
                        data: filteredRecords.map(item => item.params.unitizedChange)
                    }
                ]
            }
            setGraphData1(data1)
            setGraphData2(data2)
            setShowGraph(true)
        }
        getData()
    },[])

    return (
    <>
    <Box flex flexDirection={'row'}>
        <Box variant='white'>
            <H4>Unitized Performance Trend Analysis</H4>
            {
                showGraph &&
                <>
                    <Bar options={options} data={graphData1} width={900} height={400} />
                    <Bar options={options} data={graphData2} width={900} height={400}/>
                </> 
            }
        </Box>
        <Box py='lg' marginX={25}>
            <BasePropertyComponent
                where="show"
                property={resource.properties.customer}
                resource={resource}
                record={record}
            />
            <BasePropertyComponent
                where="show"
                property={resource.properties.currentSubPeriodDate}
                resource={resource}
                record={record}
            />
            <BasePropertyComponent
                where="show"
                property={resource.properties.currentSubPeriodUnit}
                resource={resource}
                record={record}
            />
            <BasePropertyComponent
                where="show"
                property={resource.properties.currentSubPeriodNAV}
                resource={resource}
                record={record}
            />
            <BasePropertyComponent
                where="show"
                property={resource.properties.currentSubPeriodNAVPerUnit}
                resource={resource}
                record={record}
            />
            <BasePropertyComponent
                where="show"
                property={resource.properties.netChange}
                resource={resource}
                record={record}
            />
            <BasePropertyComponent
                where="show"
                property={resource.properties.unitizedChange}
                resource={resource}
                record={record}
            />
            <BasePropertyComponent
                where="show"
                property={resource.properties.currentSubPeriodDeposited}
                resource={resource}
                record={record}
            />
            <BasePropertyComponent
                where="show"
                property={resource.properties.currentSubPeriodWithdrawn}
                resource={resource}
                record={record}
            />
            <BasePropertyComponent
                where="show"
                property={resource.properties.currentSubPeriodUnitsDeposited}
                resource={resource}
                record={record}
            />
            <BasePropertyComponent
                where="show"
                property={resource.properties.currentSubPeriodUnitsWithdrawn}
                resource={resource}
                record={record}
            />
        </Box>
    </Box>
    </>)
}

export default UnitizedPerformance