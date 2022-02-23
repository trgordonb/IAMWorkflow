import AdminJSExpress from '@adminjs/express'
import express from 'express'
import adminJs from './adminJsBuilder.mjs'

const app = express()

const ADMIN = {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'lovejs',
}


const router = AdminJSExpress.buildRouter(adminJs)
app.use(adminJs.options.rootPath, router)
await app.listen(process.env.PORT, () => { console.log('AdminJS is at localhost:8080/admin') })
