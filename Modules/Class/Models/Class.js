'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')

const ClassSchema = new Schema({
    name: { type: String, required: true, index: { unique: true, dropDups: true } },
    description: { type: String, required: true },
    image_url:{ type: String},
    deleted_at: { type: Date, default: null }
}, { timestamps: true })


ClassSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Class', ClassSchema)