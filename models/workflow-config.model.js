const mongoose = require('mongoose')
const Schema = mongoose.Schema

const WorkflowConfigSchema = new Schema({
    period: {
        type: Schema.Types.ObjectId,
        ref: 'Period',
        index: true
    },
    subPeriodEndDates: [{
        date: Date,
        name: String
    }],
    status: {
        type: String,
        default: 'In Progress',
        index: true,
        enum: ['In Progress', 'Completed']
    },
    isCurrent: {
        type: Boolean,
        index: true,
    },
    createdAt: {
        type: Date,
        index: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    currentStage: {
        type: Number
    },
    stages: [{
        number: {
            type: Number
        },
        completed: {
            type: Boolean,
            default: false
        },
        label: {
            type: String
        },
        actions: [{
            actionName: String,
            label: String,
            taskCode: String,
        }],
        data: [{
            name: String,
            modelName: String,
            queries: [{
                property: String,
                value: String,
                operator: String
            }],
            value: Number,
            subPath: String,
            locked: Boolean
        }],   
        currentTaskNumber: Number,
        tasks: [{
            code: {
                type: String
            },
            description: {
                type: String
            },
            status: {
                type: String,
                enum: ['pending','completed']
            },
            rule: {
                source: String,
                target: String
            },
            stat: {
                type: String
            },
            type: {
                type: String
            }
        }]
    }]
})


const WorkflowConfig = mongoose.model('WorkflowConfig', WorkflowConfigSchema, 'WorkflowConfigs')

module.exports = WorkflowConfig