'use strict'

const SystemSettings = require('../Models/SystemSettings')
const Pusher = require('../../../functions/pusher')
const File = require('../../../functions/file')
class SystemSettingsController {
    
    static async create(req, res, next) {
        try {
            if(req.body.id !== ""){

                let settings =  await SystemSettings.findById(req.body.id)
                settings.data = req.body
                //settings.data.logo = (req.body.logo) ? File.Image(req.body.logo,"/images/settings/", req.body.app_name,'.png') : settings.data.logo
                settings.save()
                console.log(2)
                Pusher.triggerNotification('notifications','settings',{settings,message:{msg: req.user + " updated settings."}},req,req.userId)
                return res.status(201).json({ settings: settings, msg: 'Settings Successfully updated.' })
                    
            }else{
                console.log(1)
                let settings = new SystemSettings({
                    data: req.body
                })
                //settings.data.image_url = (req.body.image) ? File.Image(req.body.image,"/images/class/", req.body.name,'.png') : ''
                await settings.save()
                Pusher.triggerNotification('notifications','settings',{settings,message:{msg: req.user+" created settings."}},req, req.userId)
                return res.status(201).json({ settings: settings, msg: 'Settings Successfully saved.' })
            }
        } catch (error) {
            return res.status(422).json({ error: error, msg: error.message })
        }
    }

    static async getAll(req, res, next) {
        try {

            let settings = await SystemSettings.findOne({}).sort('-createdAt')
            return res.status(201).json({ settings: settings })

        } catch (err) {
            return res.status(500).json(err)
        }
    }

    static async getOne(req, res, next) {
        try {

            let settings = await SystemSettings.findById(req.params.id)
            return res.status(201).json({ settings: settings })
            
        } catch (err) {
            return res.status(500).json(err)
        }
    }
}
module.exports = SystemSettingsController