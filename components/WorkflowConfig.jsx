import { Box, Button, Stepper, Step, CheckBox, Label, Table, TableHead, TableRow, TableBody, TableCell, Loader } from '@adminjs/design-system'
import { useRecord, BasePropertyComponent, ApiClient, useNotice } from 'adminjs'
import { flat } from 'adminjs'

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
    const [pdfUrl, setPdfUrl] = React.useState([])

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

    const verifyCurrentStage = async () => {
        setIsLoading(true)
        const result = await api.recordAction({
            resourceId: 'Workflow Configuration',
            recordId: record.id,
            actionName: 'verify',
            data: {byPass}
        })
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
        console.log(result)
        if (result.data.record.params.pdfData) {
            setShowPDF(true)
            const blob = new Blob([result.data.record.params.pdfData], {type: 'application/pdf'})
            const docUrl = URL.createObjectURL(blob)
            setPdfUrl(docUrl)
        }
        setIsLoading(false)
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
                            disabled={currentStep === 1}
                            mt={15}
                            mr="default"
                            onClick={() => setCurrentStep(currentStep - 1)}
                        >
                            Previous Step
                        </Button>
                        <Button
                            mt={15}
                            mr="default"
                            onClick={() => verifyCurrentStage()}
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
                    {
                        stages[currentStep-1].actions.map((action) => (
                            <Button 
                                key={action.actionName}
                                mt="xxl"
                                mr="default"
                                onClick={() => callAction(action.actionName)}
                            >
                                {action.label}
                            </Button>
                        ))
                    }
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
                            stages[currentStep-1].tasks.map((task) => (
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
                <Box mt='xxl'>
                    { showPDF && <iframe width={1400} height={800} src={pdfUrl} type="application/pdf"/>}
                </Box>
            </Box>
        </>
    )
}

export default WorkflowConfig