const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')
const passport = require('passport')
const User = require('../models/user')
const mongoose = require('mongoose')
const io = require('../server')

router.post('/login', passport.authenticate('local'), (req, res) => {
    return res.json(req.user.username)
})

router.post('/register', (req, res) => {
    req.body['_id'] = new mongoose.Types.ObjectId()
    User.create(req.body, (err, user) => {
        if (err) console.log(err)
        req.login(user, err => {
            if (!err) return res.json(user.username)
        })
        const {usersChanged} = require('../SocketManager')
        usersChanged()
    })
})

router.get('/isLoggedIn', ensureAuthenticated)

router.get('/logout', (req, res) => {
    req.logout()
    return res.send()
})

module.exports = router