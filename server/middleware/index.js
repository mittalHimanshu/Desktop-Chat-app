const User = require('../models/user')

module.exports.checkUsername = (req, res, next) => {
    const { username } = req.body
    User.findOne({ username }).exec().then(user => {
        if (user) return res.status(403).json({ "error": "user already exists" })
        else return next()
    })
}