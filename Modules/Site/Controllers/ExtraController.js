'use strict'

// const Support = require('../../Support/Models/Support')
const EmailAlert = require('../Models/Email')
const User = require('../../User/Models/User')
const SubCategory = require('../../SubCategory/Models/SubCategory')
const Activity = require('../../../functions/activity')
const result = {}
class ExtraController {

    countAllDoc(){
        return result
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