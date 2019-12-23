'use strict'

const Activity = require('../../../functions/activity')
const Pusher = require('../../../functions/pusher')
const File = require('../../../functions/file')
const User = require('../../User/Models/User')

class UserController { 
    static async update(req, res, next) {
        try {
            User.findById(req.params.id, function (error, user) {
                if (error) {
                    return res.status(501).json({ error: error, msg: error.message })
                } else {
                    user.title = (req.body.title) ? req.body.title : user.title
                    user.first_name = (req.body.first_name) ? req.body.first_name : user.first_name
                    user.brief  = (req.body.brief ) ? req.body.brief  : user.brief 
                    user.last_name = (req.body.last_name) ? req.body.last_name : user.last_name
                    user.user_type = (req.body.user_type) ? req.body.user_type : user.user_type
                    user.email = (req.body.email) ? req.body.email : user.email
                    user.username = (req.body.username) ? req.body.username : user.username
                    user.city = (req.body.city) ? req.body.city : user.city
                    user.country = (req.body.country) ? req.body.country : user.country
                    user.phone = (req.body.phone) ? req.body.phone : user.phone
                    user.postal_code = (req.body.postal_code) ? req.body.postal_code : user.postal_code
                    user.address = (req.body.address) ? req.body.address : user.address
                    user.longitude = (req.body.longitude) ? req.body.longitude : user.longitude                    
                    user.latitude = (req.body.latitude) ? req.body.latitude : user.latitude
                    user.service_id = (req.body.service_id) ? req.body.service_id : user.service_id
                    user.service_category_id = (req.body.service_category_id) ? req.body.service_category_id : user.service_category_id
                    user.profile_image = (req.body.profile_image) ? File.Image(req.body.profile_image,"/images/profile/", user.last_name,'.png') : ''
                    user.save()              
                    if(user.address != '' || user.address != null){        
                        Activity.getDecode(user,user.address)
                    }
                    Activity.Email(user, 'Profile Update', Activity.html('<p style="color: #000">Hello ' + user.first_name + ' ' + user.last_name + ', Your profile has been updated succesfully.</p>'))
                    Activity.activity_log(req, user._id, 'Profile Updated Successfully')
                    user = user.toAuthJSON()                    
                    Pusher.triggerNotification('notifications','user_updated',user,req)
                    return res.status(201).json({
                        'user': user,
                        'msg': user.first_name +
                            ' Profile Updated Successfully!'
                    })
                }

            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static getAll(req, res, next) {
        try {
            User.find({ deleted_at: null },null, { sort: { 'createdAt': -1 } }).populate('class_id').then(users => {
                return res.status(201).json({ users: users })
            }).catch(err =>{
                return res.json(err)
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static getAllApprovedUser(req, res, next) {
        try {
            User.find({ deleted_at: null, online_status: true , approval_status: true },null,{ sort: { 'createdAt': -1 } }).populate('class_id').then(users => {                
                return res.status(201).json({ users: users })
            }).catch(err =>{
                return res.json(error)
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }
    
    static getAllApprovedVendor(req, res, next) {
        try {
            User.find({ deleted_at: null, online_status: true , approval_status: true, longitude:  { $gt: req.body.longitude - 0.3, $lt: req.body.longitude + 0.3}, latitude: { $gt: req.body.latitude - 0.3, $lt: req.body.latitude + 0.3} },null,{ sort: { 'createdAt': -1 } }).then(users => {                
                return res.status(201).json({ users: users })
            }).catch(err =>{
                return res.json(error)
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static getAllServiceApprovedVendor(req, res, next) {
        try {
            User.find({ service_id: req.body.service_id, deleted_at: null, online_status: true , approval_status: true, longitude:  { $gt: req.body.longitude - 0.3, $lt: req.body.longitude + 0.3}, latitude: { $gt: req.body.latitude - 0.3, $lt: req.body.latitude + 0.3} },null,{ sort: { 'createdAt': -1 } }).then(users => {                
                return res.status(201).json({ users: users })
            }).catch(err =>{
                return res.json(error)
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static async getOne(req, res, next) {
        try {
            // User.Activities(req.params.id)
            await User.findOne({ _id: req.params.id, deleted_at: null }).populate('class_id').then((user) => {
                
                if(user){
                    user.supports().then( supports=> {                            
                        user.Activities().then( activities=> {
                            return res.status(201).json({ user:user.toAuthJSON() ,support: supports , activities : activities  })                                
                        }).catch(err => {
                            throw  err.message
                        })
                    }).catch(err => {
                        throw  err.message
                    }) 
                }                  
            }).catch(err => {
                return res.json(error)
            })
            
            
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static forgetPassword(req, res, next) {
        try {
            User.findOne({ email: req.body.email, deleted_at: null }, function (error, user) {
                if (error) {
                    return res.json({ error: error, msg: error.message })
                } else {
                    if (user) {
                        var pword = Activity.makeid(6)
                        user.password = User.hashPassword(pword)                        
                        user.save()
                        Activity.Email(user, 'Forget Password', Activity.html('<p style="color: #000">Hello ' + user.first_name + ' ' + user.last_name + ',<br/> This is your new default password.<br><span style="color: #1D4BB7">' + pword + '</span><br/>kindly log on to the application to set a new one.</p>'))
                        Activity.Sms(user.phone, 'Hello ' + user.first_name +',This is your new default password\r\n'+pword+'\r\nkindly log on to the application to set a new one.')
                        return res.status(201).json({ msg: "A mail has been sent to you." })
                    } else {
                        return res.json({ msg: 'user not found.' })
                    }
                }
            })
        } catch (error) {
            return res.json({ error: error, msg: error.message })
        }
    }

    static resetPassword(req, res, next) {
        try {
            User.findOne({ _id: req.params.id, deleted_at: null }, function (error, user) {
                if (error) {
                    return res.status(501).json({ error: error, msg: error.message })
                } else {
                    if (user.isValid(req.body.old_password)) {
                        user.password = User.hashPassword(req.body.password)
                        Activity.Email(user, 'Reset Password', Activity.html('<p style="color: #000">Hello ' + user.first_name + ' ' + user.last_name + ',You have successfully reset your password,<br>Thank you.</p>'))
                        user.save()
                        return res.status(201).json({ msg: "password reset successfully." })
                    } else {
                        return res.status(501).json({ msg: "your old password is incorrect, please check your old password." })
                    }
                }
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static delete(req, res, next) {
        try {
            User.findOneAndUpdate({ _id: req.params.id, deleted_at: null },{ $set: { deleted_at: new Date(), online_status: false } }, { upsert: true, returnNewDocument: true }, function (error, user) {
                if (error) {
                    return res.status(501).json({ error: error, msg: error.message })
                } else {
                    return res.status(201).json({ msg:"user was deleted successfully." })
                }
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static setApprovalStatus(req, res, next) {
        try {
            User.findOne({ _id: req.params.id, deleted_at: null }, function (error, user) {
                if (error) {
                    return res.status(501).json({ error: error, msg: error.message })
                } else {
                    user.approval_status = (user.approval_status == false) ? true : false
                    user.save()
                    return res.status(201).json({ msg:"user status successfully changed." })
                }
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static setOnlineStatus(req, res, next) {
        try {
            User.findOne({ _id: req.params.id, deleted_at: null }, function (error, user) {
                if (error) {
                    return res.status(501).json({ error: error, msg: error.message })
                } else {
                    user.online_status = (user.online_status == false) ? true : false
                    user.save()
                    return res.json({ msg:"user status successfully changed." })
                }
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static profileImage(req,res,next){
        try {
            User.findById(req.params.id, function (error, user) {
                if (error) {
                    return res.status(501).json({ error: error, msg: error.message })
                } else {
                    user.profile_image = (req.body.image) ? File.Image(req.body.image, user.username) : ''
                    user.save()
                    return res.status(201).json({ user: user.toAuthJSON() })
                }
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static setClass(req,res,next){
        try {
            User.findById(req.params.id, function (error, user) {
                if (error) {
                    return res.status(501).json({ error: error, msg: error.message })
                } else {
                    user.class_id = req.body.class_id
                    user.save()
                    return res.status(201).json({ user: user.toAuthJSON() })
                }
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

}

module.exports = UserController