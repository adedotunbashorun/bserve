'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ErrorsSchema = new Schema({
    
}, { timestamps: true })


module.exports = mongoose.model('Errors', ErrorsSchema)