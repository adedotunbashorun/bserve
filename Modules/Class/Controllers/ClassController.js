'use strict'
const AbstractRepository = require('../../../Abstract/AbstractRepository')
const Activity = require('../../../functions/activity')
const File = require('../../../functions/file')
const Class = require('../Models/Class')
class ClassController extends AbstractRepository {
    static create(req, res, next){
        try {
            this.createNew(Class,req.body).then(classes =>{
                classes.image_url = (req.body.image) ? File.Image(req.body.image,"/images/class/", req.body.name,'.png') : ''
                classes.save()
                Activity.activity_log(req, req.user, 'Created class')
                return res.status(201).json({ msg: 'Class created Successfully received.' })
            }).catch(error =>{
                return res.status(400).json({ error: error, msg: error.message })
            })
        } catch (error) {
            return res.status(422).json({ error: error, msg: error.message })
        }        
    }

    static getAll(req, res, next) {
        try {            
            this.findAll(Class).then((classes) => {
                return res.status(201).json({ classes: classes })
            }, (error) => {
                return res.status(501).json({ "success": false, "message": error })
            })
        } catch (err) {
            return res.status(500).json({ error: err, msg: err.message})
        }
    }

    static getOne(req, res, next) {
        try {
            this.findById(Class,req.params.id).then((classes) => {
                (req.user) ? Activity.activity_log(req, req.user._id, 'View a user record') : ''
                return res.status(201).json({ class: classes })
            }, (error) => {
                return res.status(501).json({ "success": false, "message": error })
            })
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

    static update(req, res, next) {
        Class.findById(req.params.id, function (error, classes) {
            if (error) {
                return res.json({ error: error, msg: error.message })
            } else {
                classes.name = (req.body.name) ? req.body.name : classes.name
                classes.description = (req.body.description) ?req.body.description  : classes.description
                classes.image_url = (req.body.image) ? File.Image(req.body.image,"/images/class/", classes.name,'.png') : classes.image_url
                classes.save()
                // File.cloudImage(classes,req.body.image)
                return res.status(201).json({ msg: 'classes Successfully updated.' })
            }
        })
    }

    static delete(req, res, next) {
        try {     
            Class.findOneAndRemove({ _id: req.params.id}).then( classes =>{  
                                         
                (req.user) ? Activity.activity_log(req, req.user._id, 'deleted a class') : ''
                return res.json({ msg: "class was deleted successfully" })
            }).catch(error=>{
                (req.user) ? Activity.activity_log(req, req.user._id, 'error deleting a class') : ''
                return res.status(501).json({ error: error, msg: error.message })
            })  
        } catch (error) {
            return res.status(501).json({ error: error, msg: error.message })
        }
    }

}

module.exports = ClassController