module.exports.ensureAuthenticated = (req, res) => {
    if(req.isAuthenticated()){
        return res.json(req.user.username)
    }
    else{
        return res.status(401).send(new Error('Not Logged In'))
    }
}