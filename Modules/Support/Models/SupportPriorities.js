'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PrioritySchema = new Schema({
    name: { type: String, required: true },
    deleted_at: { type: Date, default: null }
}, { timestamps: true })

module.exports = mongoose.model('Priority', PrioritySchema)