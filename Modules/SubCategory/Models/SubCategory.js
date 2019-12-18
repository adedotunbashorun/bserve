'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SubCategorySchema = new Schema({
    // user_id: { type: Schema.ObjectId, ref: 'User', default: null },
    category_id: { type: Schema.ObjectId, ref: 'Category', default: null },
    name: {
        type: String,
        required: true,
        index: { unique: true, dropDups: true }
    },
    description: {
        type: String,
        required: true
    },
    price: { type: String, required: true },    
    estimated_time : { type: String, required: true  },
    image_url:{ type: String},
    cloud_image_url: { type: String},
    deleted_at: { type: Date, default: null }
}, { timestamps: true })


module.exports = mongoose.model('SubCategory', SubCategorySchema)