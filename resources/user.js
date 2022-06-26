const bcrypt = require('bcrypt')
const AdminJS = require('adminjs')

const UserResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        userId: {
            isVisible: true,
            isTitle: true,
            position: 1
        },
        email: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            position: 2
        },
        encryptedPassword: {
            isVisible: false
        },
        password: {
            type: 'password',
            isVisible: {
                list: false, edit: true, filter: false, show: false,
            },
            position: 3
        }
    },
    actions: {
        new: {
            isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
            before: async(request) => {
                if (request.payload.password) {
                    request.payload = {
                        ...request.payload,
                        encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                        password: undefined
                    }
                }
                return request
            },
            showInDrawer: true
        },
        list: {
            //isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
            component: AdminJS.bundle('../components/UserList.jsx')
        },
        edit: {
            isAccessible: ({ currentAdmin, record }) => {
                return currentAdmin && (currentAdmin.role === 'admin' || (currentAdmin.role === 'user' && currentAdmin.id === record.params._id))
            },
            before: async(request) => {
                if (request.payload.password) {
                    request.payload = {
                        ...request.payload,
                        encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                        password: undefined
                    }
                }
                return request
            },
            showInDrawer: true
        },
        show: {
            //isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
            showInDrawer: true
        },
        filter: {
            isVisible: false,
            isAccessible: false
        },
        delete: {
            isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
        }
    }
}

module.exports = UserResource 