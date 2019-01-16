const express = require('express')
const socket = require('socket.io')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const bodyParser = require('body-parser')
const routes = require('./routes')
const path = require('path')
const app = express()

app.use(
    session({
        secret: 'himanshu-is-awesome',
        resave: true,
        saveUninitialized: true
    })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api', routes)
app.get('*', (req, res) => {
    let url = path.resolve(__dirname, '../client', 'src', 'index.html')
    res.sendFile(url)
})

require('./config/passport')(passport)

const db = require('./config/mongoKey').mongoURI
mongoose.connect(db, { useNewUrlParser: true })
    .then(console.log('MongoDB connected'))
    .catch(err => console.log('Error ', err.message))

const port = process.env.port || 5000

const server = app.listen(port, console.log('Server Started'))

const io = module.exports = socket(server)

const SocketManager = require('./SocketManager')
io.on('connection', SocketManager)