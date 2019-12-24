'use strict'
const Job = require('../Models/Job')
const User = require('../../User/Models/User')
const subCategory = require('../../SubCategory/Models/SubCategory')
const Activity = require('../../../functions/activity')
const Pusher = require('../../../functions/pusher')

class JobController {    

    static async create(req, res, next) {
        try {
            const sub_cat = await subCategory.findOne({ _id: req.body.service_category_id});
            const exist = await Job.findOne({ $and: [{vendor_id: req.body.vendor_id},{client_id: req.body.client_id},{status: 'waiting' }]});
            if(exist) {
                throw new Error('you have an existing order, please contact vendor to resolve or cancle.');
            }
            const order = new Job(req.body);
            order.estimated_time = sub_cat.estimated_time;
            order.estimated_amount = sub_cat.estimated_amount;
            await order.save();

            // await Activity.Transaction(order)

            await this.orderNotification(order.vendor_id, 'New Order Received',Activity.html('<p style="color: #000">Hello,\r\n You have received a new order.</p>'))

            await this.orderNotification(order.client_id, 'New Order Sent',Activity.html('<p style="color: #000">Hello, \r\nYour order has been received.</p>'))

            Pusher.triggerNotification('notifications','orders',{ order, message: {msg: "new order notification."}},req, order.client_id)

            Activity.activity_log(req, req.body.client_id, ' Make New  Order')
            Activity.activity_log(req, req.body.vendor_id, ' Receive New Order')

            return res.status(201).json({ msg: 'New Order Received Successfully, awaiting vendor approval.', order: order })
            
        }catch(error){
            console.log(error)
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
            let orders = await Job.find({}, null, { sort: { 'createdAt': -1 } }).populate('client_id').populate('vendor_id').populate('service_id').populate('service_category_id')
            return res.status(201).json({ orders: orders })
        } catch (err) {
            return res.status(500).json({ error: err, msg: err.message})
        }
    }

    static async getUserOrder(req, res, next) {
        try {
            let orders = await Job.find({[req.params.title]: req.params.id}, null, { sort: { 'createdAt': -1 } }).populate('client_id').populate('vendor_id').populate('service_id').populate('service_category_id')
            return res.status(201).json({ orders: orders })
        } catch (err) {
            return res.status(500).json({ error: err, msg: err.message})
        }
    }

    static async getOrder(req, res, next) {
        try {
            let order = await Job.findById(req.params.id).populate('client_id').populate('vendor_id').populate('service_id').populate('service_category_id')
            return res.status(201).json({ order: order })
        } catch (err) {
            return res.status(500).json({ error: err, msg: err.message})
        }
    }

    static async update(req, res, next) {
        try {
            
            let order = await Job.findById(req.params.id)
            order.status = (req.body.status) ? req.body.status : order.status
            order.amount = (req.body.amount) ? req.body.amount : order.amount
            order.reference = (req.body.reference) ? req.body.reference : order.reference
            order.save()
            
            if(req.body.status === 'completed') await Activity.Transaction(order);
            Pusher.triggerNotification('notifications','orders',{ order, message: {msg: `order ${order.status} notification.`}},req, req.userId)
            return res.status(201).json({ order: order, msg: 'order '+req.body.status })

        } catch (err) {
            return res.status(500).json({ error: err, msg: err.message})
        }
    }

    static async currentPendingOrders(req, res, next){
        try{

            let orders = await Job.find({ $and: [{vendor_id: req.params.vendor_id},{status: 'waiting' }]}).sort('-createdAt').populate('client_id').populate('vendor_id').populate('service_id').populate('service_category_id');
            return res.status(201).json({ orders: orders })

        }catch(error){
            return res.json({ error: error, msg: error.message})
        }
    }


    static async currentPendingOrder(req, res, next){
        try{

            let order = await Job.findOne({ $and: [{[req.params.title]: req.params.id},{status: 'waiting' }]}).sort('-createdAt').populate('client_id').populate('vendor_id').populate('service_id').populate('service_category_id');
            return res.status(201).json({ order: order })

        }catch(error){
            return res.json({ error: error, msg: error.message})
        }
    }

    static async currentPendingOrdersAdmin(req, res, next){
        try{

            let orders = await Job.find({ status: 'waiting'}).sort('-createdAt').populate('client_id').populate('vendor_id').populate('service_id').populate('service_category_id');
            return res.status(201).json({ orders: orders })

        }catch(error){
            return res.json({ error: error, msg: error.message})
        }
    }

    static async OrdersByType(req, res, next){
        try{

            let orders = await Job.find({ status: req.params.type}).sort('-createdAt').populate('client_id').populate('vendor_id').populate('service_id').populate('service_category_id');
            return res.status(201).json({ orders: orders })

        }catch(error){
            return res.json({ error: error, msg: error.message})
        }
    }

}

module.exports = JobController