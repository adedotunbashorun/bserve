'use strict'
const Job = require('../Models/Job')
const User = require('../../User/Models/User')
const subCategory = require('../../SubCategory/Models/SubCategory')
const Activity = require('../../../functions/activity')
const Pusher = require('../../../functions/pusher')

class JobController {    

    static async create(req, res, next) {
        try {

            const order = new Job(req.body)
            await order.save()

            // await Activity.Transaction(order)

            await this.orderNotification(order.vendor_id, 'New Order Received',Activity.html('<p style="color: #000">Hello,\r\n You have received a new order.</p>'))

            await this.orderNotification(order.client_id, 'New Order Sent',Activity.html('<p style="color: #000">Hello, \r\nYour order has been received.</p>'))

            Pusher.triggerNotification('notifications','orders',{ order, message: {msg: "new order notification."}},req)

            Activity.activity_log(req, req.body.client_id, ' Make New  Order')
            Activity.activity_log(req, req.body.vendor_id, ' Receive New Order')

            return res.status(201).json({ msg: 'New Order Received Successfully, awaiting vendor approval.', order: order })
            
        }catch(error){
            console.log(error.message)
            return res.json({ error: error, msg: error.message})
        }
    }


    static async orderNotification (id,subject,message, sms='') {
    
        let user = await User.findOne({id: id})
    
        if (message !== '') Activity.Email(user,subject,message);
        else Activity.Sms(user.phone,sms)
        return;
    }

    static async getAll(req, res, next) {
        try {
            let orders = await Job.find({}, null, { sort: { 'createdAt': -1 } }).populate('client_id').populate('vendor_id')
            return res.status(201).json({ orders: orders })
        } catch (err) {
            return res.status(500).json({ error: err, msg: err.message})
        }
    }

    static async getUserOrder(req, res, next) {
        try {
            let orders = await Job.find({[req.params.title]: req.params.id}, null, { sort: { 'createdAt': -1 } }).populate('client_id').populate('vendor_id')
            return res.status(201).json({ orders: orders })
        } catch (err) {
            return res.status(500).json({ error: err, msg: err.message})
        }
    }

    static async updateOrderStatus(req, res, next) {
        try {
            
            let order = await Job.findById(req.params.id)
            order.status = req.body.status
            return res.status(201).json({ order: order, msg: 'order '+req.body.status })

        } catch (err) {
            return res.status(500).json({ error: err, msg: err.message})
        }
    }

    static async uncompletedOrders(){
        try{

            let orders = await Job.find({ $and: [{status : { $ne: 'completed'}},{ status: { $ne: 'accepted'}},{vendor_id: req.params.vendor_id} ]})
            return res.status(201).json({ orders: orders })

        }catch(error){
            return res.json({ error: error, msg: error.message})
        }
    }

    static async currentPendingOrders(){
        let today = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
        try{

            let orders = await Job.find({ $and: [{status : { $ne: 'completed'}},{ status: { $ne: 'accepted'}},{createdAt: today},{vendor_id: req.params.vendor_id}]})
            return res.status(201).json({ orders: orders })

        }catch(error){
            return res.json({ error: error, msg: error.message})
        }
    }

    static async uncompletedOrdersAdmin(){
        try{

            let orders = await Job.find({ $and: [{status : { $ne: 'completed'}},{ status: { $ne: 'accepted'}} ]})
            return res.status(201).json({ orders: orders })

        }catch(error){
            return res.json({ error: error, msg: error.message})
        }
    }

    static async currentPendingOrdersAdmin(){
        let today = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
        try{

            let orders = await Job.find({ $and: [{status : { $ne: 'completed'}},{ status: { $ne: 'accepted'}},{order_date: today} ]})
            return res.status(201).json({ orders: orders })

        }catch(error){
            return res.json({ error: error, msg: error.message})
        }
    }

}

module.exports = JobController