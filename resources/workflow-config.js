const AdminJS = require('adminjs')
const stages = require('../config/stages.template')

const WorkflowConfigResource = {
    id: 'Workflow Configuration',
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        createdAt: {
            isVisible: { list: false, filter: false, show: true, edit: false },
            position: 100
        },
        createdBy: {
            isVisible: { list: false, filter: false, show: true, edit: false },
            position: 101
        },
        isCurrent: {
            isVisible: { list: true, filter: true, show: true, edit: false },
            position: 1
        },
        period: {
            isVisible: true,
            position: 2
        },
        status: {
            isVisible: { list: true, filter: true, show: true, edit: false },
            position: 3
        },
        stages: {
            isVisible: false
        },
        currentStage: {
            isVisible: false
        }
    },
    actions: {
        new: {
            before: async (request, context) => {
                const { resource, currentAdmin } = context
                resource.MongooseModel.findOneAndUpdate({
                    isCurrent: true
                }, {
                    isCurrent: false
                }, (err, doc, res) => {
                    if (err) {
                        console.log('Err:',err)
                    } else {
                        console.log('Res:',res)
                    }
                })
                request.payload = {
                    ...request.payload,
                    createdBy: currentAdmin.id,
                    createdAt: new Date(),
                    isCurrent: true,
                    currentStage: 1,
                    stages: stages
                }
                console.log(JSON.stringify(request.payload, null, 2))
                return request
            },
            isAccessible: ({ currentAdmin }) => {
                return currentAdmin && (
                  currentAdmin.role === 'admin' || currentAdmin.role === 'user'
                )
            },
            showInDrawer: true
        },
        list: {
            before: async(request, context) => {
                const { currentAdmin } = context
                return {
                    ...request,
                    query: {
                        ...request.query,
                    }
                }
            }
        },
        show: {
            isAccessible: true,
            component: AdminJS.bundle('../components/WorkflowConfig.jsx')
        },
        edit: {
            isAccessible: true,
            isVisible: false
        },
        delete: {
            isAccessible: false
        },
        bulkDelete: {
            isAccessible: false
        }
    }
}

module.exports = WorkflowConfigResource