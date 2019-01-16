const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')
const passport = require('passport')

router.get('/', ensureAuthenticated, (req, res) => {
    res.redirect('/chats')
})

router.post('/', passport.authenticate('local', {successRedirect: '/chats', failureRedirect: '/'}))

module.exports = router