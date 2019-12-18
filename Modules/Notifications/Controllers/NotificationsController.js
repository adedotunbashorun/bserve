'use strict'
const Notifications = require('../Models/Notifications')

class NotificationsController {    

    static getAll(req, res, next) {
        try {
            Notifications.find({ status: false }, null, { sort: { 'created_at': -1 },limit: 10 }, function (error, notifications) {
                if (error) return res.json(error)
                return res.status(201).json({ notifications: notifications })
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static markAsRead(req, res, next) {
        try {
            Notifications.findOne({ _id: req.params.id }, function (error, notify) {
                if (error) {
                    return res.status(501).json({ error: error, msg: error.message })
                } else {
                    notify.status = true
                    notify.save()
                    return res.json({ msg:"notification marked has read." })
                }
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

}

module.exports = NotificationsController