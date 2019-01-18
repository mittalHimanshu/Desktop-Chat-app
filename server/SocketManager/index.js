const io = require('../server')
const { updateTypingStatus,
    updateOnlineStatus,
    getUserId,
    createRoom,
    updateRoom,
    getRoomId,
    createMessage,
    updateRoomById
} = require('../factory')

module.exports.SocketManager = socket => {

    socket.join('community')

    createRoom('community')

    socket.on('new-message', payload => {
        const { username } = socket
        const { message, room } = payload
        getUserId(username, userId => {
            getRoomId(room, roomId => {
                createMessage(message, roomId, userId, msgId => {
                    updateRoomById(roomId, msgId)
                    io.in(room).emit('new-message')
                })
            })
        })
    })

    socket.on('handle-typing', payload => {
        updateTypingStatus(payload)
    })

    socket.on('handle-online-status', payload => {
        updateOnlineStatus(payload)
    })

    socket.on('set-socket-user', username => {
        socket.username = username
        getUserId(username, userId => {
            updateRoom('community', userId)
        })
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