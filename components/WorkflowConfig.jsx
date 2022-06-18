import { Box, Button, Stepper, Step, CheckBox, Label, Table, TableHead, TableRow, TableBody, TableCell, Loader } from '@adminjs/design-system'
import { useRecord, BasePropertyComponent, ApiClient, useNotice } from 'adminjs'
import { flat } from 'adminjs'
import styled from 'styled-components'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

const NewTableRow = styled.tr`background: papayawhip;`
ChartJS.register(ArcElement, Tooltip, Legend)

const WorkflowConfig = (props) => {
    const sendNotice = useNotice()
    const api = new ApiClient()
    const { record: initialRecord, resource } = props
    const { record } = useRecord(initialRecord, resource.id)
    const orgRecord = flat.get(record.params)
    const [currentStep, setCurrentStep] = React.useState(orgRecord.currentStage)
    const [stages, setStages] = React.useState(orgRecord.stages)
    const [isLoading, setIsLoading] = React.useState(false)
    const [byPass, setByPass] = React.useState(false)
    const [showPDF, setShowPDF] = React.useState(false)
    const [showPie, setShowPie] = React.useState(false)
    const [pdfUrl, setPdfUrl] = React.useState([])
    const [pieData, setPieData] = React.useState({})

    const currentStepCheck = async () => {
        if (stages[currentStep-1].completed) {
            await api.recordAction({
                resourceId: 'Workflow Configuration',
                recordId: record.id,
                actionName: 'advance',
                data: {}
            })
            return true
        } else {
            return false
        }
    }

    const verifyCurrentStage = async (skip) => {
        setIsLoading(true)
        let result
        if (!skip) {
            result = await api.recordAction({
                resourceId: 'Workflow Configuration',
                recordId: record.id,
                actionName: 'verify',
                data: {byPass}
            })
        } else {
            result = await api.recordAction({
                resourceId: 'Workflow Configuration',
                recordId: record.id,
                actionName: 'verify',
                data: {byPass: true}
            })
        }
        const newRecord = flat.get(result.data.record.params)
        setByPass(false)
        setStages([...newRecord.stages])
        setIsLoading(false)
    }

    const callAction = async (action) => {
        setIsLoading(true)
        const result = await api.recordAction({
            resourceId: 'Workflow Configuration',
            recordId: record.id,
            actionName: action,
            data: {}
        })
        const actionRecord = flat.get(result.data.record.params)
        if (actionRecord.pdfData) {
            setShowPDF(true)
            setShowPie(false)
            const blob = new Blob([result.data.record.params.pdfData], {type: 'application/pdf'})
            const docUrl = URL.createObjectURL(blob)
            setPdfUrl(docUrl)
        } else if (actionRecord.graphData) {
            setShowPDF(false)
            let graphData = actionRecord.graphData
            let labels = graphData.map(item => item.recipient)
            let dataitems = graphData.map(item => item.amount)
            setPieData({
                labels: labels,
                datasets: [{
                    label: 'Fee Shares',
                    data: dataitems,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1
                }]
            })
            setShowPie(true)
        } else {
            setShowPDF(false)
            setShowPie(false)
        }
        await verifyCurrentStage(true)
        setIsLoading(false)
    }

    const getButton = (taskCode, taskIndex) => {
        return (
            stages[currentStep-1].actions.filter(action => {
                return (action.taskCode === taskCode)
            }).map((action,idx) => (
                <Button 
                    disabled={taskIndex !== stages[currentStep-1].currentTaskNumber}
                    key={action.actionName}
                    mt="default"
                    mr="default"
                    onClick={() => callAction(action.actionName)}
                >
                    {action.label}
                </Button>
            ))
        )
    }

    return (
        <>
            <Box>
                <Box flex flexDirection={'row'} marginBottom={25}>
                    <Box flexGrow={0} marginRight={35}>
                        <BasePropertyComponent
                            where="show"
                            property={resource.properties.isCurrent}
                            resource={resource}
                            record={record}
                        />
                    </Box>
                    <Box flexGrow={0} marginRight={35}>
                        <BasePropertyComponent
                            where="show"
                            property={resource.properties.period}
                            resource={resource}
                            record={record}
                        />
                    </Box>
                    <Box flexGrow={0} marginRight={35}>
                        <BasePropertyComponent
                            where="show"
                            property={resource.properties.status}
                            resource={resource}
                            record={record}
                        />
                    </Box>
                    <Box flexGrow={0}>
                        <Button
                            mt={15}
                            mr="default"
                            onClick={() => verifyCurrentStage(false)}
                        >
                            Check Current Stage
                        </Button>
                        <Button
                            disabled={currentStep === stages.length}
                            mt={15}
                            mr="default"
                            variant="primary"
                            onClick={() => {
                                if (currentStepCheck()) {
                                    setCurrentStep(currentStep + 1)
                                } else {
                                    sendNotice({
                                        message: 'This stage has not yet completed',
                                        type: 'error'
                                    })
                                }
                            }}
                        >
                            Next Step
                        </Button>
                        <CheckBox 
                            mt={30}
                            id="byPass"
                            label='Bypass current task'
                            checked={byPass}
                            onChange={() => setByPass(!byPass)}
                        />
                        <Label inline htmlFor="byPass" ml="default">Bypass current check</Label>     
                    </Box>
                </Box>
                {isLoading && <Loader/>}
                <Stepper>
                    {stages.map(({number, label}) => (
                        <Step
                            key={number}
                            active={currentStep === number}
                            completed={currentStep > number}
                            onClick={(idx) => setCurrentStep(idx)}
                            number={number}
                        >
                            {label}
                        </Step>
                    ))}
                </Stepper>
                <Box mt="xxl">
                    <CheckBox id="stageCB" checked={stages[currentStep-1].completed}/>
                    <Label inline htmlFor="stageCB" ml="default">Completed</Label>
                </Box>
                <Box mt="xxl">
                </Box>
                <Box mt="xxl">
                    <Table>
                        <TableHead>
                            <TableCell>Code</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Completeness</TableCell>
                            <TableCell>Status</TableCell>
                        </TableHead>            
                        <TableBody>
                        {
                            stages[currentStep-1].tasks.map((task, idx) => (
                            task.type && task.type === 'action' ?
                            idx === stages[currentStep-1].currentTaskNumber ?
                                <NewTableRow key={task.code}>
                                    <TableCell>{task.code}</TableCell>
                                    <TableCell>{getButton(task.code, idx)}</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>{task.status}</TableCell>
                                </NewTableRow> :
                                <TableRow key={task.code}>
                                    <TableCell>{task.code}</TableCell>
                                    <TableCell>{getButton(task.code, idx)}</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>{task.status}</TableCell>
                                </TableRow> :
                            idx === stages[currentStep-1].currentTaskNumber ?
                                <NewTableRow key={task.code}>
                                    <TableCell>{task.code}</TableCell>
                                    <TableCell>{task.description}</TableCell>
                                    <TableCell>{task.stat}</TableCell>
                                    <TableCell>{task.status}</TableCell>
                                </NewTableRow>:
                                <TableRow key={task.code}>
                                    <TableCell>{task.code}</TableCell>
                                    <TableCell>{task.description}</TableCell>
                                    <TableCell>{task.stat}</TableCell>
                                    <TableCell>{task.status}</TableCell>
                                </TableRow>
                        ))
                        }
                        </TableBody>
                    </Table>
                </Box>
                <Box mt='xxl' width={800} height={800}>
                    { showPie && <Pie data={pieData} />}
                </Box>
                <Box mt='xxl'>
                    { showPDF && <iframe width={1400} height={800} src={pdfUrl} type="application/pdf"/>}
                </Box>
            </Box>
        </>
    )
}

export default WorkflowConfig