const io = require('../server')
const { updateTypingStatus,
    updateOnlineStatus,
    getUserId,
    // createMessage,
    createRoom
} = require('../factory')

module.exports.SocketManager = socket => {

    createRoom('community')

    socket.join('community')

    socket.on('new-message', payload => {
        const { username } = socket
        const { message, room } = payload
        // const message = createMessage({username, message, room})
        io.in(room).emit('new-message', message)
    })

    socket.on('handle-typing', payload => {
        updateTypingStatus(payload)
    })

    socket.on('handle-online-status', payload => {
        updateOnlineStatus(payload)
    })

    socket.on('set-socket-user', username => {
        socket.username = username
        // getUserId(username, id => {
        //     createRoom('community', id)
        // })
    })

    socket.on('disconnect', reason => {
        const { username } = socket
        updateOnlineStatus({ username, status: false })
        updateTypingStatus({ username, status: false })
    })

}

module.exports.usersChanged = () => {
    io.in('community').emit('users-changed')
}