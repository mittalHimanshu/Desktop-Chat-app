const User = require('./models/user')
const Room = require('./models/room')
const Message = require('./models/message')
const mongoose = require('mongoose')
const moment = require('moment')

let userSockets = {}

module.exports.setSocket = (socket, username) => {
    socket.username = username
    userSockets[`${username}`] = socket
}

module.exports.removeSocket = username => {
    delete userSockets[`${username}`]
}

module.exports.createRoom = (roomName) => {
    Room.findOne({ roomName }).exec()
        .then(room => {
            if (!room) {
                new Room({
                    _id: mongoose.Types.ObjectId(),
                    roomName
                }).save()
            }
        })
}


module.exports.updateRoomUserId = (roomName, userId) => {
    Room.updateOne({ roomName }, {
        $addToSet: {
            users: userId
        }
    }).exec().then().catch(err => console.log(err))
}

module.exports.getUserId = (username, cb) => {
    User.findOne({ username }).exec()
        .then(user => {
            return cb(user._id)
        }).catch()
}

module.exports.updateOnlineStatus = payload => {
    const { usersChanged } = require('./SocketManager')
    const { username, status } = payload
    User.updateOne({ username }, {
        $set: {
            is_active: status
        }
    }).exec().then(user => usersChanged()).catch(err => console.log(err.message))
}

// --------------------------------------------------------

module.exports.createMessage = (text, room, user, cb) => {
    const created_at = moment().format('MMMM Do YYYY, h:mm:ss A')
    new Message({ text, room, user, created_at }).save().then(msg => {
        cb(msg._id)
    })
}

module.exports.updateRoomById = (_id, msgId) => {
    Room.findByIdAndUpdate({ _id }, {
        $push: { messages: msgId }
    }).exec().then().catch(err => console.log(err.message))
}

module.exports.getRoomId = (roomName, cb) => {
    Room.findOne({ roomName }).exec()
        .then(room => {
            return cb(room._id)
        }).catch(err => err.message)
}

module.exports.getUsers = () => {
    User.find().exec().
        then(users => {
            return users
        }).catch()
}

module.exports.updateTypingStatus = payload => {
    const { usersChanged } = require('./SocketManager')
    const { username, status } = payload
    User.updateOne({ username }, {
        $set: {
            is_typing: status
        }
    }).exec().then(res => usersChanged()).catch(err => console.log(err.message))
}

module.exports.generateRoomId = (payload, cb) => {
    const { from, to } = payload
    var str = `${from}${to}`
    var arr = str.split('')
    var sorted = arr.sort()
    return cb(sorted.join(''))
}