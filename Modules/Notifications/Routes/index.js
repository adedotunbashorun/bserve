'use strict'

const express = require('express')
const router = express.Router()
const Guard = require('../../../Middleware/auth')
const NotificationsController = require('../Controllers/NotificationsController')

router.get('/notifications', [Guard.isValidUser], (req, res, next) => {
    NotificationsController.getAll(req, res, next)
})

router.get('/markasread/:id', [Guard.isValidUser], (req, res, next) => {
    NotificationsController.markAsRead(req, res, next)
})

module.exports = router