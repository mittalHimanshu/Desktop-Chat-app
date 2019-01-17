const User = require('./models/user')

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