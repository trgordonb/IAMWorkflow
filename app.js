const express = require("express");
const { Server } = require("socket.io")
const { createServer } = require("http")

const app = express()
const httpServer = createServer(app)
let sockets = {}

const io = new Server(httpServer, { /* options */ });
    io.on("connection", (socket) => {
        sockets[socket.handshake.query.id] = socket.id
        console.log('Connect from ', socket.id)
        if (socket.handshake.headers.group) {
            socket.join(socket.handshake.headers.group)
            console.log(`${socket.id} join ${socket.handshake.headers.group}`)
        }
        socket.on('disconnect', () => {
            console.log('Disconnect from ', socket.id)
            if (sockets.hasOwnProperty(socket.handshake.query.id)) {
                delete sockets[socket.handshake.query.id]
            }
        })
    });
app.set('io', io)

module.exports = { app, httpServer, io }