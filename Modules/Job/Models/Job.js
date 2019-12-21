'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const JobSchema = new Schema({
    client_id: { type: Schema.ObjectId, ref: 'User', default: null },
    vendor_id: { type: Schema.ObjectId, ref: 'User', default: null },
    service_id: { type: Schema.ObjectId, ref: 'Category', default: null },
    service_category_id: { type: Schema.ObjectId, ref: 'SubCategory', default: null },
    address: { type: String, default:  null },    
    destination_longitude: { type: String, default: '' },
    destination_latitude: { type: String, default: '' },
    time: {type : Date, default: null},
    payment_type: { type: String, default:  null },
    estimated_amount: { type: String, default:  null },
    amount: { type: String, default:  null },
    status: { type: String, default: ''},
    deleted_at: { type: String, default:  null },
}, { timestamps: true })


module.exports = mongoose.model('Job', JobSchema)