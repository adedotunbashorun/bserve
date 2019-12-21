'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = require('../../../service/Model')

const PaymentSchema = new Schema({
    reference: { type: String, lowercase: true },
    order_id: { type: Schema.ObjectId, ref: 'Order' },
    client_id: { type: Schema.ObjectId, ref: 'User', default: null },
    vendor_id: { type: Schema.ObjectId, ref: 'User', default: null },
    type: { type: String },
    status: { type: String, required: true },
    message: { type: String },
    fees: { type: String },
    fees_split: { type: String },
    amount: { type: String, required: true },
    deleted_at: { type: Date, default: null }
}, { timestamps: true })

class PaymentClass extends Model{
    constructor(name = 'Payment'){
        this.model = name
    }

    async orders() {        
        return await this.belongsTo(this.model = 'Order','order_id',this.order_id)
    }
}


PaymentSchema.loadClass(PaymentClass)
module.exports = mongoose.model('Payment', PaymentSchema)