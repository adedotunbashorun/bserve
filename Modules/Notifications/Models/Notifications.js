'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotificationsSchema = new Schema({
    user_id: { type: Schema.ObjectId, ref: 'User' },
    name: { type: String, required: true},
    type: {type: String, required: true},    
    data: {type: Object, required: true},    
    status: {type: String, default: false }
}, { timestamps: true })


module.exports = mongoose.model('Notifications', NotificationsSchema)