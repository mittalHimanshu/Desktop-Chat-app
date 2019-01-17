const User = require('./models/user')
const Room = require('./models/room')
const Message = require('./models/message')
const mongoose = require('mongoose')

module.exports.createMessage = (text, user, room) => {
    const msg = new Message({text, room, user})
    msg.save({text, room, user})
        .then(msgObj => console.log(msgObj))
}

module.exports.getRoomId = (roomName, cb) => {
    Room.findOne({roomName}).exec()
        .then(room => {
            return cb(room._id)
        }).catch(err => err.message)
}

module.exports.createRoom = roomName => {
    Room.findOne({roomName}).exec()
        .then(room => {
            if(!room){
                const newRoom = new Room({
                    _id: mongoose.Types.ObjectId(),
                    roomName,
                })
                newRoom.save().then().catch(err => console.log(err.message))
            }
        }).catch(err => console.log(err.message))
}

module.exports.updateRoom = (roomName, payload) => {
    Room.updateOne({roomName}, {
        $push : {
            users: payload
        }
    }).exec().then().catch(err => console.log(err))
}

module.exports.getUserId = (username, cb) => {
    User.findOne({username}).exec()
        .then(user => {
            return cb(user._id)
        }).catch()
}

module.exports.getUsers = () => {
    User.find().exec().
        then(users => {
            return users
        }).catch()
}

module.exports.updateTypingStatus = payload => {
    const {usersChanged} = require('./SocketManager')
    const { username, status } = payload
    User.updateOne({ username }, {
        $set: {
            is_typing: status
        }
    }).exec().then(res => usersChanged()).catch(err => console.log(err.message))
}

module.exports.updateOnlineStatus = payload => {
    const {usersChanged} = require('./SocketManager')
    const { username, status } = payload
    User.updateOne({ username }, {
        $set: {
            is_active: status
        }
    }).exec().then(res => usersChanged()).catch(err => console.log(err.message))
}