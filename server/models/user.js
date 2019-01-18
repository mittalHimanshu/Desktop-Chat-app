const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    is_active: { type: Boolean, default: false },
    is_typing: { type: Boolean, default: false }
})

UserSchema.pre('save', function(next) {
    var user = this
    bcrypt.hash(user.password, 10, (err, hash) => {
        if(err) return next(err)
        user.password = hash
        next()
    })
})

module.exports = mongoose.model('User', UserSchema, 'User')