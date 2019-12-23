'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const uniqueValidator = require('mongoose-unique-validator')
const Model = require('../../../service/Model')
const jwt = require('jsonwebtoken')

const UserSchema = new Schema({
    user_type: { type: String, lowercase: true, default: 'client' },
    class_id: { type: Schema.ObjectId, ref: 'Class', default: null },
    service_id: { type: Schema.ObjectId, ref: 'Category', default: null },    
    service_category_id: { type: Schema.ObjectId, ref: 'SubCategory', default: null },
    title: { type: String, default: '' },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, default: null },
    city: { type: String, default: null },
    country: { type: String, default: null },
    postal_code: { type: String, default: null },
    phone: { type: String, default: '' },
    phone_code: { type: String, default: null },
    profile_image: { type: String, default: ''},
    address: { type: String, default: '' },
    longitude: { type: String, default: '' },
    latitude: { type: String, default: '' },
    online_status : { type: Boolean, default: false },
    approval_status : { type: Boolean, default: false },
    brief : { type: String, default: '' },
    email: {
        type: String,
        lowercase: true,
        required: true,
        validate: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        index: { unique: true, dropDups: true }
    },
    password: { type: String, required: true},
    is_active: { type: Boolean, required: true, default: false },
    temporarytoken: { type: String, default: null },
    deleted_at: { type: Date, default: null }
}, { timestamps: true })
class UserClass extends Model{
    constructor(name = 'User'){
        this.model = name
    }

    static hashPassword(password) {
        return bcrypt.hashSync(password, 10)
    }

    isValid  (hashedPassword) {
        return bcrypt.compareSync(hashedPassword, this.password)
    }
    
    supports() {
        return new Promise((resolve, reject) =>{
            this.hasMany(this.model = 'Support','user_id',this._id).then(res =>{
                resolve(res)
            }).catch(err =>{
                reject(err)
            })
        })
    }

    Activities() {
        return new Promise((resolve, reject) =>{
            this.hasMany(this.model = 'ActivityLog','user_id',this._id).then(res =>{
                resolve(res)
            }).catch(err =>{
                reject(err)
            })
        })
        
    }

    class() {
        return new Promise((resolve,reject) =>{
            this.belongsTo(this.model = 'Class', '_id', this.class_id).then(res =>{
                resolve(res)
            }).catch(err =>{
                reject(err)
            })
        })
    }

    generateJWT () {
        const today = new Date();
        const expirationDate = new Date(today);
        expirationDate.setDate(today.getDate() + 60);
      
        return jwt.sign({
          email: this.email,
          id: this._id,
          exp: parseInt(expirationDate.getTime() / 1000, 10),
        }, 'Beauty');
    }
      
    toAuthJSON () {
        return {
            _id: this._id,
            email: this.email,
            user_type: this.user_type,
            service_id: this.service_id,
            class_id: this.class_id,
            title: this.title,
            first_name: this.first_name,
            last_name: this.last_name,
            username: this.username,
            city: this.city,
            country: this.country,
            postal_code: this.postal_code,
            phone: this.phone,
            profile_image: this.profile_image,
            address: this.address,
            longitude: this.longitude,
            latitude: this.latitude,
            online_status : this.online_status,
            approval_status : this.approval_status,
            brief : this.brief,
            is_active: this.is_active
        }
    }
}


UserSchema.loadClass(UserClass)
UserSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', UserSchema)