const io = require('../server')
const { updateTypingStatus,
    updateOnlineStatus,
    getUserId,
    createRoom,
    updateRoomUserId,
    getRoomId,
    generateRoomId,
    createMessage,
    updateRoomById,
    setSocket,
    removeSocket,
    findAndJoinRoom,
    generateTempMessage
} = require('../factory')

module.exports.SocketManager = socket => {

    socket.join('community')

    createRoom('community')

    socket.on('disconnect', reason => {
        const { username } = socket
        removeSocket(username)
        updateOnlineStatus({ username, status: false })
        updateTypingStatus({ username, status: false })
    })

    socket.on('set-socket-user', payload => {
        const { username } = payload
        setSocket(socket, username)
        getUserId(username, userId => {
            updateRoomUserId('community', userId)
        })
    })

    socket.on('handle-online-status', payload => {
        updateOnlineStatus(payload)
    })

    socket.on('handle-typing', payload => {
        updateTypingStatus(payload)
    })

    socket.on('set-private-room', payload => {
        generateRoomId(payload, roomName => {
            socket.join(roomName)
            findAndJoinRoom(payload.to, roomName)
            createRoom(roomName, roomName => {
                if (!roomName) return
                getUserId(payload.from, userId => {
                    updateRoomUserId(roomName, userId)
                })
                getUserId(payload.to, userId => {
                    updateRoomUserId(roomName, userId)
                })
            })
        })
    })

    socket.on('new-message', payload => {
        const { username, room, message } = payload

        generateRoomId({ from: username, to: room }, roomName => {

            generateTempMessage({username, text: message, room}, msg => {
                io.in(roomName).emit('new-message', msg)
            })

            getUserId(username, userId => {
                getRoomId(roomName, roomId => {
                    createMessage(message, roomId, userId, msg => {
                        updateRoomById(roomId, msg._id)
                    })
                })
            })
        })
    })

}

module.exports.usersChanged = () => {
    io.in('community').emit('users-changed')
}