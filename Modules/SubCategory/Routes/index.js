'use strict'

const express = require('express')
const router = express.Router()
const Guard = require('../../../Middleware/auth')
const SubCategoryController = require('../Controllers/SubCategoryController')

router.post('/subcategory', [Guard.isValidAdmin], (req, res, next) => {
    SubCategoryController.create(req, res, next)
})

router.patch('/subcategory/:id', [Guard.isValidAdmin], (req, res, next) => {
    SubCategoryController.update(req, res, next)
})

router.get('/subcategories', [Guard.isValidUser], (req, res, next) => {
    SubCategoryController.getAll(req, res, next)
})

router.get('/subcategories/:category_id', [Guard.isValidUser], (req, res, next) => {
    SubCategoryController.getCategoryQuestion(req, res, next)
})

router.get('/subcategory/:id', [Guard.isValidUser], (req, res, next) => {
    SubCategoryController.getOne(req, res, next)
})

router.delete('/subcategory/:id', [Guard.isValidAdmin], (req, res, next) => {
    SubCategoryController.delete(req, res, next)
})

module.exports = router