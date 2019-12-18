'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = require('../../../service/Model')

const UserCategorySchema = new Schema({
    user_id: { type: Schema.ObjectId, ref: 'User', required: true },
    category_id: { type: Schema.ObjectId, ref: 'Category', default: null },    
    sub_category_id: { type: Schema.ObjectId, ref: 'SubCategory', default: null },
}, { timestamps: true })

class UserCategoryClass extends Model{
    constructor(name = 'UserCategory'){
        this.model = name
    }
    
    
}


UserCategorySchema.loadClass(UserCategoryClass)
module.exports = mongoose.model('UserCategory', UserCategorySchema)