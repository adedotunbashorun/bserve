'use strict'

const express = require('express')
const router = express.Router()
const Guard = require('../../../Middleware/auth')
const CategoryController = require('../Controllers/CategoryController')

router.post('/category', [Guard.isValidAdmin], (req, res, next) => {
    CategoryController.create(req, res, next)
})

router.patch('/category/:id', [Guard.isValidAdmin], (req, res, next) => {
    CategoryController.update(req, res, next)
})

router.get('/categories', [Guard.isValidUser], (req, res, next) => {
    CategoryController.getAll(req, res, next)
})

router.get('/category/:id', [Guard.isValidUser], (req, res, next) => {
    CategoryController.getOne(req, res, next)
})

router.delete('/category/:id', [Guard.isValidAdmin], (req, res, next) => {
    CategoryController.delete(req, res, next)
})

router.get('/seed/categories',(req,res,next) => {
    CategoryController.seeder(req,res,next)
})

module.exports = router