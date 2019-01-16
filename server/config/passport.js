const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user')

module.exports = passport => {
    passport.use(new LocalStrategy((username, password, next) => {

        User.findOne({ username })
            .then(user => {
                if (!user) return next(null, false, { message: 'Username not found' })

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err
                    if (isMatch) return next(null, user)
                    else return next(null, false, { message: 'Password Incorrect' })
                })

            })
    })
    )

    passport.serializeUser((user, next) => {
        next(null, user.id)
    })

    passport.deserializeUser((id, next) => {
        User.findById(id, (err, user) => {
            next(err, user)
        })
    })
}