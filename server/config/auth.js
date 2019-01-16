module.exports.ensureAuthenticated = ensureAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) return next()
    res.redirect('/')
}