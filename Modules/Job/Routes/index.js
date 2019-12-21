'use strict'

const express = require('express')
const router = express.Router()
const Guard = require('../../../Middleware/auth')
const OrderController = require('../Controllers/JobController')

router.get('/orders', [Guard.isValidUser], (req, res, next) => {
    OrderController.getAll(req, res, next)
})

router.post('/order', [Guard.isValidUser], (req, res, next) => {
    OrderController.create(req, res, next)
})

router.get('/orders/:title/:id', [Guard.isValidUser], (req, res, next) => {
    OrderController.getUserOrder(req, res, next)
})

router.patch('/orders/update/status/:id', [Guard.isValidUser], (req, res, next) => {
    OrderController.updateOrderStatus(req, res, next)
})

router.get('/orders/pending/:vendor_id', [Guard.isValidUser], (req, res, next) => {
    OrderController.currentPendingOrders(req, res, next)
})

router.get('/orders/admin/pending', [Guard.isValidAdmin], (req, res, next) => {
    OrderController.currentPendingOrdersAdmin(req, res, next)
})

module.exports = router