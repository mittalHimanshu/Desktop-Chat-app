module.exports.ensureAuthenticated = (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).json({ "username": req.user.username })
    }
    else {
        return res.status(401).json({ "message": "Not Logged In" })
    }
}