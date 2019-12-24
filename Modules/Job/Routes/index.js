'use strict'

const express = require('express')
const router = express.Router()
const Guard = require('../../../Middleware/auth')
const OrderController = require('../Controllers/JobController')

router.get('/orders', [Guard.isValidUser], (req, res, next) => {
    OrderController.getAll(req, res, next)
})

router.get('/order/:id', [Guard.isValidUser], (req, res, next) => {
    OrderController.getOrder(req, res, next)
})

router.post('/order', [Guard.isValidUser], (req, res, next) => {
    OrderController.create(req, res, next)
})

router.get('/orders/:title/:id', [Guard.isValidUser], (req, res, next) => {
    OrderController.getUserOrder(req, res, next)
})

router.patch('/order/update/:id', [Guard.isValidUser], (req, res, next) => {
    OrderController.update(req, res, next)
})

router.get('/order/:title/:id', [Guard.isValidUser], (req, res, next) => {
    OrderController.currentPendingOrder(req, res, next)
})

router.get('/orders/user/pending/:vendor_id', [Guard.isValidUser], (req, res, next) => {
    OrderController.currentPendingOrders(req, res, next)
})

router.get('/orders/admin/pending/all', [Guard.isValidAdmin], (req, res, next) => {
    OrderController.currentPendingOrdersAdmin(req, res, next)
})

router.get('/orders/:type', [Guard.isValidAdmin], (req, res, next) => {
    OrderController.OrdersByType(req, res, next)
})

module.exports = router