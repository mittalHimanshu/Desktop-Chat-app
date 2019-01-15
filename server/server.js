var express = require('express')
var socket = require('socket.io')
const app = express()

const port = process.env.port || 5000

const server = app.listen(port, console.log('Server Started'))

const io = module.exports = socket(server)

const SocketManager = require('./SocketManager')
io.on('connection', SocketManager)