const express = require('express')
const socket = require('socket.io')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const bodyParser = require('body-parser')
const { authRoutes, messageRoutes } = require('./routes')
const app = express()

app.use(
    session({
        secret: 'himanshu',
        resave: false,
        saveUninitialized: false
    })
)

app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/auth', authRoutes)
app.use('/messages', messageRoutes)
// app.get('*', (req, res) => {
//     let url = path.resolve(__dirname, '../client/dist', 'client', 'index.html')
//     res.sendFile(url)
// })

require('./config/passport')(passport)

const db = require('./config/mongoKey').mongoURI
mongoose.connect(db, { useNewUrlParser: true })
    .then(console.log('MongoDB connected'))
    .catch(err => console.log('Error ', err.message))

const port = process.env.port || 5000

const server = app.listen(port, console.log('Server Started'))

const io = module.exports = socket(server)

const { SocketManager } = require('./SocketManager')
io.on('connection', SocketManager)