const bcrypt = require('bcrypt')

const UserResource = {
    properties: {
        _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
        },
        encryptedPassword: {
            isVisible: false
        },
        password: {
            type: 'string',
            isVisible: {
                list: false, edit: true, filter: false, show: false,
            }
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
            isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
        },
        edit: {
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
        show: {
            isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
            showInDrawer: true
        },
        filter: {
            isAccessible: ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin',
        }
    }
}

module.exports = UserResource 