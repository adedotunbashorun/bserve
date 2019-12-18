var passport = require('passport')
var User = require('../Modules/User/Models/User')
const setReq = (req,user, next) => {
    req.userId = user._id;
    req.email = user.email;
    next()
}
module.exports = {
    isValidUser: function(req, res, next) {
        if (passport.authenticate('jwt', { session: false })) {
            User.findOne({ temporarytoken: req.headers.authorization }).then(function(user) {
                if (user) setReq(req,user, next)
                else return res.status(401).json({ "success": false, "message": "token is undefined " })
            }, function(error) {
                return res.status(401).json({ "success": false, "message": error })
            })
        } else return res.status(401).json({ 'msg': 'UnAuthorized Request!' })
    },
    
    isBasic: function(req, res, next) {
        
        User.findOne({ temporarytoken: req.headers.authorization }).then(function(user) {
            if (user) setReq(req,user, next)
            else return res.status(401).json({ "success": false, "message": "token is undefined " })
        }, function(error) {
            return res.status(401).json({ "success": false, "message": error })
        })
    },

    isValidAdmin: function(req, res, next) {
        if (passport.authenticate('jwt', { session: false })) {
            User.findOne({ temporarytoken: req.headers.authorization }).then(function(user) {
                if (user && user.user_type == 'admin') setReq(req,user, next)
                else return res.status(401).json({ "success": false, "message": "token is undefined " })
            }, function(error) {
                return res.status(401).json({ "success": false, "message": error })
            })
        } else return res.status(401).json({ 'msg': 'UnAuthorized Request!' })
    }
}