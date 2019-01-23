const User = require('../models/user')

module.exports.checkUsername = (req, res, next) => {
    const { username } = req.body
    User.findOne({ username }).exec().then(user => {
        if (user) return res.status(403).json({ "error": "user already exists" })
        else return next()
    })
}

module.exports.checkAlreadyLogin = (req, res, next) => {
    const { username } = req.body
    User.findOne({ username }).exec().then(user => {
        if(user.is_active) return res.status(406).json({ "error": "user already loggedin" })
        else return next()
    })
}