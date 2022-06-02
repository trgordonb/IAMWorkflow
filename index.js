const AdminJSExpress = require('@adminjs/express')
const AdminJS = require('adminjs')
const { app, httpServer } = require('./app')
const bcrypt = require('bcrypt')
const adminJsConfig = require('./adminJsConfig')
const AdminJsMongoose = require('@adminjs/mongoose')
const mongoose = require('mongoose')
const UserModel = require('./models/user.model')
const WorflowConfig = require('./models/workflow-config.model')

AdminJS.registerAdapter(AdminJsMongoose)
AdminJS.bundle('./components/LoggedIn', 'LoggedIn')
AdminJS.bundle('./components/CustomSidebar', 'SidebarResourceSection')
MONGO_URL = process.env.MONGO_URL

async function main() {
    await mongoose.connect(MONGO_URL, {ssl: true})
    const adminJs = new AdminJS(adminJsConfig.adminJsConfig)
    
    //const router = AdminJSExpress.buildRouter(adminJs)
    const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
        authenticate: async (userId, password) => {
            let user = await UserModel.findOne({ userId })
            if (user) {
                const matched = await bcrypt.compare(password, user.encryptedPassword)
                const workflow = await WorflowConfig.findOne({isCurrent: true})
                if (matched) {
                    return {
                        email: user.userId,
                        title: user.role,
                        id: user._id,
                        role: user.role,
                        avatarUrl: `https://ui-avatars.com/api/?name=${user.userId}`,
                        period: workflow?.period
                    }
                }
            }
            return false
        },
        cookiePassword: process.env.COOKIE_PASSWORD
    })
    
    app.use(adminJs.options.rootPath, router)
    
    await httpServer.listen(process.env.PORT, () => { 
        console.log('AdminJS is at localhost:8080/admin') 
    })
}
  
main();