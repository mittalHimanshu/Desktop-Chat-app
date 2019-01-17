const User = require('./models/user')
const Room = require('./models/room')
const mongoose = require('mongoose')

// module.exports.createMessage = message => {

// }

module.exports.createRoom = roomName => {

    Room.findOne({roomName}).exec()
        .then(room => {
            if(!room){
                const newRoom = new Room({
                    _id: mongoose.Types.ObjectId(),
                    roomName,
                })
                newRoom.save().then(room => console.log(room)).catch(err => console.log(err.message))
            }
        }).catch(err => console.log(err.message))
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