'use strict'

const express = require('express')
const router = express.Router()
const Guard = require('../../../Middleware/auth')
const ClassController = require('../Controllers/ClassController')

router.post('/class', [Guard.isValidAdmin], (req, res, next) => {
    ClassController.create(req, res, next)
})

router.patch('/class/:id', [Guard.isValidAdmin], (req, res, next) => {
    ClassController.update(req, res, next)
})

router.get('/classes', [Guard.isValidUser], (req, res, next) => {
    ClassController.getAll(req, res, next)
})

router.get('/class/:id', [Guard.isValidUser], (req, res, next) => {
    ClassController.getOne(req, res, next)
})

router.delete('/class/:id', [Guard.isValidAdmin], (req, res, next) => {
    ClassController.delete(req, res, next)
})

module.exports = router