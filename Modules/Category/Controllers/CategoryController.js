'use strict'
const Category = require('../Models/Category')
const catSeeder = require('../Seeders/CategorySeeder')
const SubCategory = require('../../SubCategory/Models/SubCategory')
const Activity = require('../../../functions/activity')
const File = require('../../../functions/file')

class CategoryController {    

    static create(req, res, next) {
        try {
            if (!req.body.name) {
                return res.status(422).json({ 'error': 'Please provide name' })
            }
            if (!req.body.description) {
                return res.status(422).json({ 'error': 'Please provide description' })
            }
            
            const category = new Category()
            category.name = req.body.name            
            category.description = req.body.description
            category.price = req.body.price   
            category.estimated_time = req.body.estimated_time        
            category.image_url = (req.body.image) ? File.Image(req.body.image,"/images/category/", req.body.name,'.png') : ''
            category.save(function (error) {
                if (error) {
                    return res.json({ error: error, msg: error.message })
                } else {
                    // File.cloudImage(category,req.body.image)
                    Activity.activity_log(req, req.user, 'Created Category')
                    return res.status(201).json({ msg: 'Category created Successfully received.' })
                }
            })
        } catch (error) {
            return res.status(422).json({ error: error, msg: error.message })
        }
    }

    static getAll(req, res, next) {
        try {
            Category.find({}, null, { sort: { 'createdAt': -1 } }).then((categories) => {
                return res.status(201).json({ categories: categories })
            }, (error) => {
                return res.status(501).json({ "success": false, "message": error })
            })
        } catch (err) {
            return res.status(500).json({ error: err, msg: err.message})
        }
    }

    static getOne(req, res, next) {
        try {
            Category.findOne({ _id: req.params.id, deleted_at: null }, function (error, category) {
                if (error) {
                    (req.user) ? Activity.activity_log(req, req.user._id, 'View a user record') : ''
                    return res.status(501).json({ error: error, msg: error.message })
                } else {
                    category.service_categories().then( service_categories=> {
                        return res.status(201).json({ category:category , service_categories : service_categories  })                                
                    }).catch(err => {
                        throw  err.message
                    })
                }
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static update(req, res, next) {
        Category.findById(req.params.id, function (error, category) {
            if (error) {
                return res.json({ error: error, msg: error.message })
            } else {
                category.name = (req.body.name) ? req.body.name : category.name
                category.description = (req.body.description) ?req.body.description  : category.description
                category.price = (req.body.price)  ? req.body.price : category.price 
                category.estimated_time = (req.body.estimated_time) ? req.body.price : category.price
                category.image_url = (req.body.image) ? File.Image(req.body.image,"/images/category/", category.name,'.png') : category.image_url
                category.save()
                // File.cloudImage(category,req.body.image)
                return res.status(201).json({ msg: 'Category Successfully updated.' })
            }
        })
    }

    static delete(req, res, next) {
        try {                     
            Category.findOneAndRemove({ _id: req.params.id}).then( category =>{   
                if (category) {
                    SubCategory.find({ category_id: req.params.id }).remove().exec()
                }                            
                (req.user) ? Activity.activity_log(req, req.user._id, 'deleted a user') : ''
                return res.json({ msg: "category was deleted successfully" })
            }).catch(error=>{
                (req.user) ? Activity.activity_log(req, req.user._id, 'error deleting a user') : ''
                return res.status(501).json({ error: error, msg: error.message })
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static seeder(req,res,next){
        catSeeder.seed(req,res);
    }

}

module.exports = CategoryController