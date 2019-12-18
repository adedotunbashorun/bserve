let Pushers= require('pusher')
let pusher_notifiction = new Pushers({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER
})
let Notifications = require('../Modules/Notifications/Models/Notifications')
class Pusher{

    constructor(){        
        this.pushers = pusher_notifiction               
    }

    static triggerNotification(notifications = 'notifications', type, data,req,id) {
        if(req.headers['x-socket-id']){
            pusher_notifiction.trigger(notifications, type, data, req.headers['x-socket-id'])
            return this.saveNotification(notifications = 'notifications', type, data,id)  
        }             
    }

    static saveNotification(notifications = 'notifications', type, data,user_id){
        let notify = new Notifications()
        notify.name = notifications
        notify.user_id = user_id
        notify.type = type
        notify.data = data
        notify.save()
        return notify
    }
}

module.exports = Pusher