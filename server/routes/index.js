const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')
const passport = require('passport')
const User = require('../models/user')

// router.get('/', ensureAuthenticated, (req, res) => {
//     res.redirect('/chats')
// })

router.post('/login', passport.authenticate('local'),
    (req, res) => {
        console.log(req.user)
        res.send(req.user)
    }
)

router.post('/register', (req, res) => {
    User.create(req.body, (err, user) => {
        if (err) console.log(err)
        res.status(200).end()
    })
})

module.exports = router