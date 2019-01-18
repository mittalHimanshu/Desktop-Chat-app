const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/', (req, res, next) => {
    User.find().exec()
        .then(users => {
            res.status(200).json(users).end()
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

module.exports = router