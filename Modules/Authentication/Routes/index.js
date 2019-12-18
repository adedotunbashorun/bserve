'use strict'

const express = require('express');
const router = express.Router();
const Guard = require('../../../Middleware/auth');
const AuthenticationController = require('../../Authentication/Controllers/AuthenticationController');

router.post('/register', (req, res, next) => {
    AuthenticationController.register(req, res, next);
});

router.patch('/activate/:token', (req, res, next) => {
    AuthenticationController.Activate(req, res, next);
});

router.patch('/activates/:id', (req, res, next) => {
    AuthenticationController.ActivateUser(req, res, next);
});

router.get('/toggle_online_status/:id', (req, res, next) => {
    AuthenticationController.toggleUserOnlineStatus(req, res, next);
});

router.get('/activate/:token', (req, res, next) => {
    AuthenticationController.Activate(req, res, next);
});

router.post('/login', (req, res, next) => {
    AuthenticationController.login(req, res, next);
});

router.get("/logout", [Guard.isValidUser], function (req, res, next) {
    AuthenticationController.logout(req, res, next);
});

module.exports = router;