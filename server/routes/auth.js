const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')
const passport = require('passport')
const User = require('../models/user')
const mongoose = require('mongoose')
const { checkUsername, checkAlreadyLogin } = require('../middleware')

router.get('/isLoggedIn', ensureAuthenticated)

router.get('/logout', (req, res) => {
    req.logout()
    return res.status(200).json({ "message": "Successfully Logged Out" })
})

router.get('/users', (req, res, next) => {
    User.find().exec()
        .then(users => {
            res.status(200).json({ "users": users })
        })
        .catch(err => {
            res.status(500).json({ "error": err.message })
        })
})

router.post('/login', passport.authenticate('local'), checkAlreadyLogin, (req, res) => {
    return res.json({ "username": req.user.username })
})

router.post('/register', checkUsername, (req, res) => {
    req.body['_id'] = new mongoose.Types.ObjectId()
    console.log(req.body)
    User.create(req.body, (err, user) => {
        if (err) return res.status(500).json({ "error": err.message })
        req.login(user, err => {
            if (err) return res.status(500).json({ "error": err.message })
            else return res.status(200).json({ "username": user.username })
        })
        const { usersChanged } = require('../SocketManager')
        usersChanged()
    })
})

module.exports = router