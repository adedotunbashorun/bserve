'use strict'

const express = require('express')
const router = express.Router()
const Guard = require('../../../Middleware/auth')
const UserController = require('../../User/Controllers/UserController')
const User = require('../../User/Seeders/userSeeder')

router.patch('/user/update/:id', [Guard.isBasic], (req, res, next) => {
    UserController.update(req, res, next)
})

router.get('/users', [Guard.isValidAdmin], (req, res, next) => {
    UserController.getAll(req, res, next)
})

router.get('/approved/users', [Guard.isValidUser], (req, res, next) => {
    UserController.getAllApprovedUser(req, res, next)
})

router.post('/all/closeby/vendors', [Guard.isValidUser], (req, res, next) => {
    UserController.getAllApprovedVendor(req, res, next)
})

router.post('/all/closeby/service/vendors', [Guard.isValidUser], (req, res, next) => {
    UserController.getAllServiceApprovedVendor(req, res, next)
})

router.get('/user', [Guard.isValidUser], (req, res, next) => {
    return res.status(200).json(req.user)
})

router.get('/user/:id', [Guard.isValidUser], (req, res, next) => {
    UserController.getOne(req, res, next)
})

router.get('/user/set_approval_status/:id', [Guard.isValidAdmin], (req, res, next) => {
    UserController.setApprovalStatus(req, res, next)
})

router.get('/user/set_online_status/:id', [Guard.isValidUser], (req, res, next) => {
    UserController.setOnlineStatus(req, res, next)
})

router.delete('/user/:id', [Guard.isValidAdmin], (req, res, next) => {
    UserController.delete(req, res, next)
})

router.post('/forget_password', (req, res, next) => {
    UserController.forgetPassword(req, res, next)
})

router.post('/reset_password/:id',  [Guard.isValidUser], (req, res, next) => {
    UserController.resetPassword(req, res, next)
})

router.post('/user/set_class',[Guard.isValidUser], (req, res, next) => {
    UserController.setClass(req, res, next)
})

router.get('/seed/user', (req, res, next) => {
    User.seedUser(req, res)
})

module.exports = router