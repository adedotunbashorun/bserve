'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SupportRepliesSchema = new Schema({
    user_id: { type: Schema.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    dispute_id: { type: Schema.ObjectId, ref: 'Support' },
    deleted_at: { type: Date, default: null }
}, { timestamps: true })

module.exports = mongoose.model('SupportReplies', SupportRepliesSchema)