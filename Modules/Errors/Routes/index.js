'use strict'

const express = require('express')
const router = express.Router()
const ErrorsController = require('../Controllers/ErrorsController')

router.get('/', (request, response, next) => {
    response.send("Welcome to Express Modular.")
})

module.exports = router