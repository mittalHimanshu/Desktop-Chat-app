const io = require('../server')
const { updateTypingStatus, updateOnlineStatus } = require('../factory')

module.exports.SocketManager = socket => {
    console.log(socket.id)

    socket.on('new-message', message => {
        io.emit('new-message', message)
    })

    socket.on('handle-typing', payload => {
        updateTypingStatus(payload)
    })

    socket.on('handle-online-status', payload => {
        updateOnlineStatus(payload)
    })

    socket.on('set-socket-user', username => {
        socket.username = username
    })

    socket.on('disconnect', reason => {
        const { username } = socket
        updateOnlineStatus({username, status: false})
        updateTypingStatus({username, status: false})
    })

}

module.exports.usersChanged = () => {
    io.emit('users-changed')
}