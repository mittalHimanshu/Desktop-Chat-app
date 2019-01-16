const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')
const passport = require('passport')
const User = require('../models/user')

router.post('/login', passport.authenticate('local'), (req, res) => {
    return res.send(req.user)
})

router.post('/register', (req, res) => {
    User.create(req.body, (err, user) => {
        if (err) console.log(err)
        req.login(user, err => {
            if(!err) return res.send()
        })
    })
})

router.get('/isLoggedIn', ensureAuthenticated)

router.get('/logout', (req, res) => {
    req.logout()
    return res.send()
})

module.exports = router