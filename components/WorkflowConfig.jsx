import { Box, Button, Stepper, Step, CheckBox, Label, Table, TableHead, TableRow, TableBody, TableCell, Loader, Overlay } from '@adminjs/design-system'
import { useRecord, BasePropertyComponent, ApiClient, useNotice, useCurrentAdmin } from 'adminjs'
import { flat } from 'adminjs'

const WorkflowConfig = (props) => {
    const sendNotice = useNotice()
    const [currentAdmin, setCurrentAdmin] = useCurrentAdmin()
    const api = new ApiClient()
    const { record: initialRecord, resource, action } = props
    const { record, handleChange, submit } = useRecord(initialRecord, resource.id)
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
        let tmpStages = orgRecord.stages
        await Promise.all(stages[currentStep-1].tasks.map(async (task, index) => {
            let taskSource = task.rule.source
            let taskTarget = task.rule.target
            let taskSourceQueriesIndex = stages[currentStep-1].data.findIndex(item => item.name === taskSource) 
            let taskTargetQueriesIndex = stages[currentStep-1].data.findIndex(item => item.name === taskTarget)
            let taskSourceItem = stages[currentStep-1].data[taskSourceQueriesIndex]
            let taskTargetItem = stages[currentStep-1].data[taskTargetQueriesIndex]
            let taskSourceQueries = taskSourceItem.queries 
            let taskTargetQueries = taskTargetItem.queries
            let taskSourceResourceId = taskSourceItem.resourceId
            let taskTargetResourceId = taskTargetItem.resourceId
            let taskSourceQueriesDict = {}
            taskSourceQueries.forEach(query => {
                if (query.property === 'filters.period') {
                    query.value = currentAdmin.period
                }
                taskSourceQueriesDict[query.property] = query.value
            })   
            let taskTargetQueriesDict = {}
            taskTargetQueries.forEach(query => {
                if (query.property === 'filters.period') {
                    query.value = currentAdmin.period
                }
                taskTargetQueriesDict[query.property] = query.value
            })   
            const resultSource = await api.resourceAction({
                resourceId: taskSourceResourceId,
                actionName: 'list',
                params: taskSourceQueriesDict
            })
            const resultTarget = await api.resourceAction({
                resourceId: taskTargetResourceId,
                actionName: 'list',
                params: taskTargetQueriesDict
            })
            if (!tmpStages[currentStep-1].data[taskSourceQueriesIndex].locked) {
                tmpStages[currentStep-1].data[taskSourceQueriesIndex].value = resultSource.data.meta.total
            }
            if (!tmpStages[currentStep-1].data[taskTargetQueriesIndex].locked) {
                tmpStages[currentStep-1].data[taskTargetQueriesIndex].value = resultTarget.data.meta.total 
            }
            let sourceTotal = tmpStages[currentStep-1].data[taskSourceQueriesIndex].value * taskSourceItem.factor
            let targetTotal = tmpStages[currentStep-1].data[taskTargetQueriesIndex].value * taskTargetItem.factor
            tmpStages[currentStep-1].tasks[index].stat = `${targetTotal } / ${sourceTotal}`
            if (sourceTotal === targetTotal && targetTotal > 0 && sourceTotal > 0 && tmpStages[currentStep-1].tasks[index].status === 'pending') {
                tmpStages[currentStep-1].tasks[index].status = 'completed'
                tmpStages[currentStep-1].data[taskSourceQueriesIndex].locked = true
                tmpStages[currentStep-1].data[taskTargetQueriesIndex].locked = true
            }
        }))
        let completedTasksCount = tmpStages[currentStep-1].tasks.filter(task => task.status === 'completed').length
        if (completedTasksCount === tmpStages[currentStep-1].tasks.length) {
            tmpStages[currentStep-1].completed = true
        }

        setStages([...tmpStages])
        await api.recordAction({
            resourceId: 'Workflow Configuration',
            recordId: record.id,
            actionName: 'edit',
            data: {
                stages: tmpStages
            }
        })
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