import { Box, Button, Stepper, Step, CheckBox, Label, Table, TableHead, TableRow, TableBody, TableCell, Loader } from '@adminjs/design-system'
import { useRecord, BasePropertyComponent, ApiClient, useNotice, useCurrentAdmin } from 'adminjs'
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

    const currentStepCheck = () => {
        if (stages[currentStep-1].completed) {
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
            data: {}
        })
        const newRecord = flat.get(result.data.record.params)
        setStages([...newRecord.stages])
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
                            disabled={currentStep === 3}
                            mt={15}
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
                    <CheckBox id="stageCB" value={stages[currentStep-1].completed}/>
                    <Label inline htmlFor="stageCB" ml="default">Completed</Label>
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
            </Box>
        </>
    )
}

export default WorkflowConfig