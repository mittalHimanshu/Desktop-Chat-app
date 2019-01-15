const io = require('../server')

module.exports = socket => {
    console.log(socket.id)

    socket.on('new-message', message => {
        io.emit('new-message', message)
    })
}