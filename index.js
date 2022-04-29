const AdminJSExpress = require('@adminjs/express')
const AdminJS = require('adminjs')
const express = require('express')
const bcrypt = require('bcrypt')
const adminJsConfig = require('./adminJsConfig')
const AdminJsMongoose = require('@adminjs/mongoose')
const mongoose = require('mongoose')
const UserModel = require('./models/user.model')

AdminJS.registerAdapter(AdminJsMongoose)
let MONGO_URL = ''
if (process.env.NODE_ENV !== 'production') {
    MONGO_URL = `mongodb://root:${process.env.MONGO_URL}:27017/IAMTest?authSource=admin`
} else {
    MONGO_URL = `mongodb://root:${process.env.MONGO_PASSWORD}@${process.env.REPLICASET_1}:27017,${process.env.REPLICASET_2}:27017/test?authSource=admin&replicaSet=rs0`
}

async function main() {
    const app = express()
   
    await mongoose.connect(MONGO_URL)

    const adminJs = new AdminJS(adminJsConfig.adminJsConfig)
    const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
        authenticate: async (userId, password) => {
            let user = await UserModel.findOne({ userId })
            if (user) {
                const matched = await bcrypt.compare(password, user.encryptedPassword)
                if (matched) {
                    return {
                        email: user.userId,
                        title: user.role,
                        id: user._id,
                        role: user.role,
                        avatarUrl: `https://ui-avatars.com/api/?name=${user.userId}`
                    }
                }
            }
            return false
        },
        cookiePassword: process.env.COOKIE_PASSWORD
    })
    app.use(adminJs.options.rootPath, router)
    await app.listen(process.env.PORT, () => { console.log('AdminJS is at localhost:8080/admin') })
}
  
main();