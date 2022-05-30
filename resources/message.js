const AdminJS = require('adminjs')

const MessageResource = {
    id: 'Message',
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        hasRead: {
            isVisible: { list: true, filter: true, show: true, edit: false },
            position: 1
        },
        text: {
            isVisible: { list: true, filter: false, show: true, edit: false },
            position: 2
        },
        link: {
            isVisible: { list: false, filter: false, show: true, edit: false },
            position: 3,
            components: {
                show: AdminJS.bundle('../components/PageLink.jsx')
            }
        },
        target: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        date: {
            type: 'date',
            isVisible: { list: true, filter: true, show: true, edit: false },
        }
    },
    actions: {
        list: {
            before: async (request, context) => {
                const { currentAdmin } = context
                return {
                    ...request,
                    query: {
                       ...request.query,
                       'filters.target': currentAdmin.id,
                       'filters.hasRead': false
                    }
                }
            },
        },
        show: {
            after: async(response, request, context) => {
                const { record, resource, currentAdmin } = context
                await record.update({hasRead: true})
                return response
            },
            showInDrawer: true
        },
        edit: {
            isAccessible: false
        },
        new: {
            isAccessible: false
        },
        delete: {
            isAccessible: false
        },
        bulkDelete: {
            isAccessible: false
        }
    }
}

module.exports = MessageResource