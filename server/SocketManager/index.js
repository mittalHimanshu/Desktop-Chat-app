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
    removeSocket
} = require('../factory')

module.exports.SocketManager = socket => {

    socket.join('community')

    createRoom('community')

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

    // ----------------------------------------------
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

    socket.on('new-private-message', (payload, cb) => {
        const { username } = socket
        const { message, from, to } = payload
        generateRoomId({ from, to }, roomName => {
            getUserId(username, userId => {
                getRoomId(roomName, roomId => {
                    createMessage(message, roomId, userId, msgId => {
                        updateRoomById(roomId, msgId)
                        cb()
                    })
                })
            })
        })
    })

    socket.on('set-private-room', payload => {
        generateRoomId(payload, roomName => {
            createRoom(roomName, roomName => {
                if (!roomName) return
                getUserId(payload.from, userId => {
                    updateRoom(roomName, userId)
                })
                getUserId(payload.to, userId => {
                    updateRoom(roomName, userId)
                })
            })
        })
    })

    socket.on('get-chat-room-id', (payload, cb) => {
        generateRoomId(payload, roomName => {
            cb(roomName)
        })
    })

    socket.on('disconnect', reason => {
        const { username } = socket
        removeSocket(username)
        updateOnlineStatus({ username, status: false })
        updateTypingStatus({ username, status: false })
    })

}

module.exports.usersChanged = () => {
    io.in('community').emit('users-changed')
}