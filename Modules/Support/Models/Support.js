'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SupportSchema = new Schema({
    user_id: { type: Schema.ObjectId, ref: 'User' },
    ticket_no: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: 'pending' },
    dispute_priority_id: { type: Schema.ObjectId, ref: 'Priority', required: true },
    deleted_at: { type: Date, default: null }
}, { timestamps: true })

module.exports = mongoose.model('Support', SupportSchema)