'use strict'

const Support = require('../../Support/Models/Support')
const Priority = require('../../Support/Models/SupportPriorities')
const Replies = require('../../Support/Models/SupportReplies')
const crypto = require('crypto')
const Activity = require('../../../functions/activity')

class SupportController {

    static create(req, res, next) {
        try {
            if (!req.body.title) {
                return res.status(422).json({ 'error': 'Please provide title for your support message' })
            }
            if (!req.body.message) {
                return res.status(422).json({ 'error': 'Please provide support message' })
            }
            if (!req.body.dispute_priority_id) {
                return res.status(422).json({ 'error': 'Please provide priority' })
            }
            const support = new Support()
            support.user_id = req.body.user._id
            support.title = req.body.title
            support.dispute_priority_id = req.body.dispute_priority_id
            support.message = req.body.message
            support.ticket_no = crypto.randomBytes(10).toString('hex')
            support.save(function(error) {
                if (error) {
                    return res.status(401).json({ error: error, msg: error.message })
                } else {
                    Activity.Email('', 'New Support Message', Activity.html('<p style="color: #000">Hello Administrator', support.message + '<br> from ' + req.body.user.email + ' with the phone number ' + req.body.phone + '.</p>'))
                    Activity.SupportEmail(req, 'New Support Message Recieve ' + support.ticket_no, Activity.html('<p style="color: #000">Hello ' + req.body.user.first_name + ",<br/>Your support message has been recieved, with the Ticket ID " + support.ticket_no + ". You can track your support mail with your Ticket ID.</p>"))
                    Activity.activity_log(req, req.body.user_id, req.body.user.first_name + ' Sent Administrator a message')
                    return res.status(201).json({ msg: 'support message Successfully received.' })
                }
            })
        } catch (error) {
            return res.status(422).json({ error: error, msg: error.message })
        }
    }

    static create_reply(req, res, next) {
        try {
            if (!req.body.message) {
                return res.status(422).json({ 'msg': 'Please provide support message' })
            }
            const reply = new Replies()
            reply.user_id = req.body.user_id
            reply.dispute_id = req.body.dispute_id
            reply.message = req.body.message
            reply.save(function(error) {
                if (error) {
                    return res.status(401).json({ error: error, msg: error.message })
                } else {
                    // Activity.Email('', 'New Support Message', 'Hello Administrator', support.message + '\n from ' + req.body.user.email + ' with the phone number ' + req.body.phone + '.')
                    // Activity.Email(support, 'New Support Message Recieve ' + support.ticket_no, 'Hello ' + req.body.user.first_name + ", \n Your support message has been recieved, with the ticket number " + support.ticket_no + ". You can track your support mail with this number.")
                    Activity.activity_log(req, req.user_id, ' Sent Administrator a message')
                    return res.status(201).json({ msg: 'support message Successfully replied.' })
                }
            })
        } catch (error) {
            return res.status(422).json({ error: error, msg: error.message })
        }
    }

    static getAll(req, res, next) {
        try {
            Support.find({}, null, { sort: { 'createdAt': -1 } }).populate('user_id').then((supports) => {
                return res.status(201).json({ supports: supports })
            }, (error) => {
                return res.status(501).json({ "success": false, "message": error })
            })
        } catch (err) {
            return res.status(500).json(err)
        }
    }

    static getUserSupport(req, res, next) {
        Support.find({ user_id: req.params.user_id }, null, { sort: { 'created_at': -1 } }).populate("user_id").then(function(supports) {
            return res.status(201).json({ supports: supports })
        }, function(error) {
            return res.status(501).json({ "success": false, "message": error })
        })
    }

    static getUserReplies(req, res, next) {
        Replies.find({ dispute_id: req.params.dispute_id }, null, { sort: { 'created_at': -1 } }).populate("user_id").populate('dispute_id').then(function(replies) {
            return res.status(201).json({ replies: replies })
        }, function(error) {
            return res.status(501).json({ "success": false, "message": error })
        })
    }

    static getSupport(req, res, next) {
        Support.findOne({ _id: req.params._id }).populate("user_id").then(function(support) {
            return res.status(201).json({ support: support })
        }, function(error) {
            return res.status(501).json({ "success": false, "message": error })
        })
    }

    static updateSupportStatus(req, res, next) {
        Support.findOne({ _id: req.params._id }).then(function(support) {
            support.status = req.body.status
            support.save()
            return res.status(201).json({ support: support, msg: 'support status updated successfully.' })
        }, function(error) {
            return res.status(501).json({ "success": false, "message": error })
        })
    }

    static getPriority(req, res, next) {
        try {
            Priority.find({}).then((priorities) => {
                return res.status(201).json({ priorities: priorities })
            }, (error) => {
                return res.status(501).json({ "success": false, "message": error })
            })
        } catch (err) {
            return res.status(500).json(err)
        }
    }
}
module.exports = SupportController