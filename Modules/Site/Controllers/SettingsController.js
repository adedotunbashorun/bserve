'use strict'

const SystemSettings = require('../Models/SystemSettings')
const Pusher = require('../../../functions/pusher')
const File = require('../../../functions/file')
class SystemSettingsController {
    
    static create(req, res, next) {
        try {
            let setting = {
                data: req.body
            }
            if(req.body._id !== ""){
                SystemSettings.findOneAndUpdate({_id: req.body._id }, setting ,{upsert: true, new: true},function(error, settings) {
                    if (error) {
                        return res.status(401).json({ error: error, msg: error.message })
                    } else {
                        settings.data.logo = (req.body.logo) ? File.Image(req.body.logo,"/images/settings/", req.body.app_name,'.png') : settings.data.logo
                        settings.save()
                        Pusher.triggerNotification('notifications','settings',{settings,message:{msg: req.user + " updated settings."}},req)
                        return res.status(201).json({ settings: settings, msg: 'Settings Successfully updated.' })
                    }
                })
            }else{
                var settings = new SystemSettings(setting)
                settings.image_url = (req.body.image) ? File.Image(req.body.image,"/images/class/", req.body.name,'.png') : ''
                settings.save()
                settings.save(function(error) {
                    if (error) {
                        return res.status(401).json({ error: error, msg: error.message })
                    } else {
                        Pusher.triggerNotification('notifications','settings',{settings,message:{msg: req.user+" created settings."}},req)
                        return res.status(201).json({ settings: settings, msg: 'Settings Successfully saved.' })
                    }
                })
            }
        } catch (error) {
            return res.status(422).json({ error: error, msg: error.message })
        }
    }

    static getAll(req, res, next) {
        try {
            SystemSettings.findOne({}, null, { sort: { 'createdAt': -1 } }).then((settings) => {
                return res.status(201).json({ settings: settings })
            }, (error) => {
                return res.status(501).json({ "success": false, "message": error })
            })
        } catch (err) {
            return res.status(500).json(err)
        }
    }

    static getOne(req, res, next) {
        try {
            SystemSettings.findOne({ _id: req.params.id }, null, { sort: { 'createdAt': -1 } }).then((settings) => {
                return res.status(201).json({ settings: settings })
            }, (error) => {
                return res.status(501).json({ "success": false, "message": error })
            })
        } catch (err) {
            return res.status(500).json(err)
        }
    }
}
module.exports = SystemSettingsController