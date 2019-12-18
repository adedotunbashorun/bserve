'use strict'
const Activity = require('../../../functions/activity')
const SubCategory = require('../Models/SubCategory')
const File = require('../../../functions/file')

class SubCategoryController {    

    static create(req, res, next) {
        try {
            if (!req.body.category_id || req.body.category_id == null) {
                return res.json({ 'error': 'error', 'msg': 'Please provide service for service category' })
            }
            if (!req.body.name) {
                return res.json({ 'error': 'error','msg': 'Please provide name' })
            }
            if (!req.body.description) {
                return res.json({ 'error': 'error','msg': 'Please provide description' })
            }
            // if(!isNaN(req.body.estimated_time)){
            //     return res.json({ 'error': 'error', 'msg':'Please Estimated Time should be a number in mintues' })
            // }
            const sub_cat = new SubCategory()
            sub_cat.category_id = req.body.category_id
            sub_cat.name = req.body.name            
            sub_cat.description = req.body.description 
            sub_cat.price = req.body.price                
            sub_cat.estimated_time = req.body.estimated_time        
            sub_cat.image_url = (req.body.image) ? File.Image(req.body.image,"/images/subcategory/", req.body.name,'.png') : ''

            sub_cat.save(function (error) {
                if (error) {
                    console.log(error)
                    return res.json({ error: error, msg: error.message })
                } else {
                    Activity.activity_log(req, req.user, 'Created Service Category')
                    return res.status(201).json({ msg: 'Service Category created Successfully.' })
                }
            })
        } catch (error) {
            console.log(error)
            return res.json({ error: error, msg: error.message })
        }
    }

    static getAll(req, res, next) {
        try {
            SubCategory.find({}, null, { sort: { 'createdAt': -1 } }).populate('category_id').then((subcategories) => {
                return res.status(201).json({ subcategories: subcategories })
            }, (error) => {
                return res.status(501).json({ "success": false, "message": error })
            })
        } catch (err) {
            return res.status(500).json(err)
        }
    }

    static getCategorySub(req, res, next) {
        try {
            SubCategory.find({ category_id: req.params.category_id}, null, { sort: { 'createdAt': -1 } }).then((subcategories) => {
                return res.status(201).json({ subcategories: subcategories })
            }, (error) => {
                return res.status(501).json({ "success": false, "message": error })
            })
        } catch (err) {
            return res.status(500).json(err)
        }
    }

    static getOne(req, res, next) {
        try {
            SubCategory.findOne({ _id: req.params.id, deleted_at: null }).then((  subcategory) => {
                return res.status(201).json({ subcategory: subcategory })                
                }).catch((error) => {
                    (req.user) ? Activity.activity_log(req, req.user._id, 'View a user record') : ''
                    return res.status(501).json({ error: error, msg: error.message })
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static update(req, res, next) {
        SubCategory.findById(req.params.id, function (error, subcategory){
            if (error) {
                return res.json({ error: error, msg: error.message })
            } else {
                subcategory.category_id = (req.body.category_id) ? req.body.category_id : subcategory.category_id
                subcategory.name = (req.body.name) ? req.body.name : subcategory.name
                subcategory.description = (req.body.description) ? req.body.description : subcategory.description 
                subcategory.price = (req.body.price)  ? req.body.price : subcategory.price  
                sub_cat.estimated_time = req.body.estimated_time          
                subcategory.image_url = (req.body.image) ? File.Image(req.body.image,"/images/subcategory/", req.body.name,'.png') : subcategory.image_url
                subcategory.save()
                return res.status(201).json({ msg: 'Service Category Successfully updated.' })
            }
        })
    }

    static delete(req, res, next) {
        try {
            SubCategory.findOneAndRemove({ _id: req.params.id, deleted_at: null }).then( (subcategory) => {
                // if (subcategory) {
                //     Schedule.find({ subcategory_id: req.params.id }).remove().exec()
                //     Response.find({ subcategory_id: req.params.id }).remove().exec()
                // }  
                (req.user) ? Activity.activity_log(req, req.user._id, 'deleted a Service Category') : ''
                return res.json({ msg:"Service Category was deleted successfully" })                
            }).catch(error =>{
                (req.user) ? Activity.activity_log(req, req.user._id, 'error deleting a Service Category') : ''
                return res.status(501).json({ error: error, msg: error.message })
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

}

module.exports = SubCategoryController