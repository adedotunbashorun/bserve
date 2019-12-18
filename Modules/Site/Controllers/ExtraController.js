'use strict'

// const Support = require('../../Support/Models/Support')
const EmailAlert = require('../Models/Email')
const User = require('../../User/Models/User')
const Order = require('../../Job/Models/Job')
const Activity = require('../../../functions/activity')
class ExtraController {

    static async countAllDoc(req, res, next){
        let users = await User.countDocuments();
        let vendors = await User.find({user_type: 'vendor'}).countDocuments();
        let clients = await User.find({user_type: 'client'}).countDocuments();
        let orders = await Order.find().countDocuments();
        let activities = await Activity.find({user_id: req.userId}).sort('-createdAt').populate("user_id").limit(5);
        let user_activities = await Activity.find().sort('-createdAt').populate("user_id").limit(5);
        return res.status(200).json({ users, vendors, clients, orders, activities, user_activities });
    }    

    static deactivateAlertEmail(req, res, next) {
        EmailAlert.findOne({ email: req.params.email }).then(function (email) {
            email.status = 0
            email.save()
            return res.status(201).json({ msg: 'you have unsubscribed from latest deals alert.' })
        }, function (error) {
            return res.status(501).json({ "success": false, "message": error })
        })
    }

    static emailAlert(req,res,next){
        EmailAlert.findOne({ email: req.params.email }).then(function (email) {
            if(email.email === req.params.email)
                return res.status(201).json({ msg: 'you are a subscribed member, thanks you!' })
            else
                Activity.alertEmail(req)
                Activity.Email(req.body, 'Brax Alert', Activity.html('<p style="color: #000">Hello ' + req.body.email + '<br>, Thank you for creating a price alert at Brax Map.we will update you with our latest and cheapest deals.<br><br><br><br><br>click <a href="https://braxmap.com/unsubscribe/"' + req.body.email + '>here</a> to unsubscribe</p>'))
                return res.status(201).json({ msg: 'Email Alert Successfully Activated.' })
        }, function (error) {
            return res.status(501).json({ "success": false, "message": error })
        })
        
    }
}
module.exports = ExtraController