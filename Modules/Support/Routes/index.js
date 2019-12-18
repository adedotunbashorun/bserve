'use strict'

const express = require('express')
const router = express.Router()
const Guard = require('../../../Middleware/auth')
const SupportController = require('../../Support/Controllers/SupportController')
const Priority = require('../../Support/Seeders/prioritySeeder')

router.post('/support', [Guard.isValidUser], (req, res, next) => {
    SupportController.create(req, res, next)
})

router.post('/support/reply', [Guard.isValidUser], (req, res, next) => {
    SupportController.create_reply(req, res, next)
})

router.get('/supports', [Guard.isValidUser], (req, res, next) => {
    SupportController.getAll(req, res, next)
})

router.get('/support/user/:user_id', [Guard.isValidUser], (req, res, next) => {
    SupportController.getUserSupport(req, res, next)
})

router.get('/support/:_id', [Guard.isValidUser], (req, res, next) => {
    SupportController.getSupport(req, res, next)
})

router.patch('/support/status/:_id', [Guard.isValidUser], (req, res, next) => {
    SupportController.updateSupportStatus(req, res, next)
})

router.get('/support/replies/:dispute_id', [Guard.isValidUser], (req, res, next) => {
    SupportController.getUserReplies(req, res, next)
})

router.get('/priorities', [Guard.isValidUser], (req, res, next) => {
    SupportController.getPriority(req, res, next)
})
router.get('/seed/priority', (req, res, next) => {
    Priority.seedPriorities(req, res)
})

module.exports = router