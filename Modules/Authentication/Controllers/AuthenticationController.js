'use strict'

const passport = require('passport')
const crypto = require('crypto')
const User = require('../../User/Models/User')
const Activity = require('../../../functions/activity')
const Pusher = require('../../../functions/pusher')
let ObjectId = require('mongoose').Types.ObjectId
let token

class AuthenticationController{

    static  async register(req, res, next) {
        try {
            if (typeof req.body.password === 'undefined' || req.body.password == "")
                return res.status(501).json({ error: "password is required" })
            
            let user = new User()
            user.title = req.body.title
            user.user_type = (req.body.user_type) ? req.body.user_type : 'client'            
            user.service_id = (req.body.service_id) ? req.body.service_id : null
            user.service_category_id = (req.body.service_category_id) ? req.body.service_category_id : null
            user.first_name = (req.body.first_name) ? req.body.first_name : ''
            user.last_name = req.body.last_name
            user.email = req.body.email
            user.phone = req.body.phone
            user.phone_code = Math.floor(1000 + Math.random() * 9000)
            user.password = User.hashPassword(req.body.password)
            user.temporarytoken = crypto.randomBytes(20).toString('hex')
            user.address = req.body.address
            await user.save();

            Activity.getDecode(user,req.body.address)
            Activity.Email(user, 'New Registration', Activity.html('<p style="color: #000">Hello ' + user.first_name + ' ' + user.last_name + ', Thank you for registering at ServeMe.<br> Please click the link below to complete registration https://servemeserviceappapi.herokuapp.com/api/activate/' + user.temporarytoken + '</p>'))
            Activity.Sms(user.phone, 'Hello '+ user.first_name+' this is your activation code '+user.phone_code )
            Activity.activity_log(req, user._id, 'Registered')                    
            Pusher.triggerNotification('notifications','users',{user, message: {msg: user.last_name + " Just created a new account."}},req, user._id)
            return res.status(201).json({ user: user.toAuthJSON(), msg: 'Registration Successful, Please activate your account by visiting your mail.' })
                
        } catch (error) {
            return res.json({ error: error, msg: error.message })
        }
    }

    static Activate(req, res, next) {
        try{
            
            User.findOne({ $or :[ {temporarytoken: req.params.token},{ phone_code: req.params.token }] }).then((user) => {
                if(user){
                    user.temporarytoken = null
                    user.phone_code = null
                    user.is_active =   true
                    token = user.generateJWT()
                    user.temporarytoken = token
                    user.online_status = true                    
                    user.save()            
                    Activity.Email(user, 'Account Activated', Activity.html('<p style="color: #000">Hello ' + user.first_name + ' ' + user.last_name + ', Thank you for registering at Refill. Your Account has been activated successfully.'))
                    return res.status(201).json({msg:'user activation successful', token: token});
                }else{
                    if(isNaN(req.params.token)){
                        return res.status(401).json({msg:req.params.token+' is not a number'});
                    }
                    return res.status(401).json({msg:'Invalid code'});
                }                     

            }).catch((err)=>{
                console.log(err.message)
                return res.status(401).json(err);
            })
        } catch (error) {
            return res.json({ error: error, msg: error.message })
        }
    }

    static async ActivateUser(req, res, next) {
        try{
            let user = await User.findOne({ _id: req.params.id });
            user.temporarytoken = null;
            user.phone_code = null;
            user.is_active =  (user.is_active == true) ? false : true;
            user.save();
            if(user.is_active == false) {
                Activity.Email(user, 'Account De-activated', Activity.html('<p style="color: #000">Hello ' + user.first_name + ' ' + user.last_name + ', Thank you for using ServeMe. Your Account has been de-activated please contact support for re-activation @ weserve.com.ng \n\r Thank You.'));
                return res.status(201).json({msg:'user de-activation successful'});
            }
            Activity.Email(user, 'Account Activated', Activity.html('<p style="color: #000">Hello ' + user.first_name + ' ' + user.last_name + ', Thank you for registering at ServeMe. Your Account has been activated successfully.'))
            return res.status(201).json({msg:'user activation successful'});
        } catch (error) {
            return res.json({ error: error, msg: error.message })
        }
    }

    static async toggleUserOnlineStatus(req, res, next) {
        try{
            let user = await User.findOne({ _id: req.params.id });
            user.online_status =  (user.online_status === 'true') ? 'false' : 'true'
            user.save()
            if(user.online_status === 'false') {
                return res.status(201).json({msg:'user mode set to offline', user: user})
            }
            return res.status(201).json({msg:'user mode set to online', user: user});
        } catch (error) {
            return res.json({ error: error, msg: error.message })
        }
    }


    static login(req, res, next) {
        try{
            passport.authenticate('local', { session: false }, function (err, user, info) {
                if (err) { return res.json(err) }
                if (!user) { return res.json(info) }
                req.logIn(user, { session: false }, function (err) {
                    if (err) { return res.status(401).json({ error: error, msg: error.message }) }
                    token = user.generateJWT()
                    User.findOneAndUpdate({ email: user.email }, { $set: { temporarytoken: token, online_status: true } }, { upsert: true, returnNewDocument: true }).then(function (user) {
                        if (user != null) next()
                    })
                    return res.status(201).json({ 'msg': 'Login Successful!', token: token, user: user.toAuthJSON() })
                })
            })(req, res, next)
        } catch (error) {
            return res.json({ error: error, msg: error.message })
        }
    }

    static logout(req, res, next) {

        try{
            User.findOne({ temporarytoken: req.headers.authorization }).then((user) => {
                if (user) {
                    user.temporarytoken = null;
                    user.online_status = false;   
                    user.save();
                }
                req.logout()
                return res.status(201).json({
                    'msg': 'Logout Successfull!',
                    token: null
                });
            }).catch((err) => {
                return res.status(401).json({
                    'msg': 'Unable to logout'
                });
            })
        } catch (error) {
            return res.json({ error: error, msg: error.message })
        }        
    }
}

module.exports = AuthenticationController