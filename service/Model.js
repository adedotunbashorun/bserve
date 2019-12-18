const mongoose = require('mongoose')

class Model {

    constructor(){
    }
    belongsTo(model, relation, through){
        this.model(model).findOne({ [relation]: through}).exec((err, res) => {
            if(err) return ''
            else return res
        })
    }

    hasOne(model, relation, through){
        this.model(model).findOne({ [relation]: through}).exec((err, res) => {
            if(err) return ''
            else return res
        })
    }

    hasMany(model, relation, through){
        return new Promise((resolve, reject) => {
            mongoose.model(model).find({ [relation]: through}).exec((err, res) => {
                if(err) reject(err)
                else { return resolve(res) }
            })
        })
    }

    belongsToMany(model,related_model, relation, through){
        this.model(model).find({ [relation]: through}).populate([related_model]).exec((err, res) => {
            if(err) return ''
            else return res[related_model]
        })
    }

    hasOneThrough(model,related_model, related_model_foreignKey ,relation, through){
        
    }
}

module.exports = Model