'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator')
const Model = require('../../../service/Model');

const CategorySchema = new Schema({
    name: { type: String, required: true, index: { unique: true, dropDups: true } },
    description: { type: String, required: true },
    price: { type: String, default : null },
    estimated_time : { type: String, default: null },
    image_url:{ type: String},
    cloud_image_url: { type: String},
    deleted_at: { type: Date, default: null }
}, { timestamps: true })

class CategoryClass extends Model{

    get newName() {
        return this.name.CharAt(0).toUpperCase();
    }
    
    service_categories() {
        return new Promise((resolve, reject) =>{
            this.hasMany(this.model = 'SubCategory','category_id',this._id).then(res =>{
                resolve(res)
            }).catch(err =>{
                reject(err)
            })
        })
    }
    
}
CategorySchema.loadClass(CategoryClass)
CategorySchema.plugin(uniqueValidator)
module.exports = mongoose.model('Category', CategorySchema)