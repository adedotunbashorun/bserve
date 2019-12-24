'use strict'

const express = require('express')
const router = express.Router()
const Guard = require('../../../Middleware/auth')
const Activity = require('../../../functions/activity')
const ExtraController = require('../Controllers/ExtraController')
const ContactController = require('../Controllers/ContactController')
const ActivityController = require('../Controllers/ActivityController')
const MailSettingsController = require('../Controllers/MailSettingsController')
const SystemSettingsController = require('../Controllers/SettingsController')


router.post('/settings',[Guard.isValidAdmin], (req, res, next) => {
    SystemSettingsController.create(req, res, next)
})

router.get('/settings',[Guard.isValidUser], (req, res, next) => {
    SystemSettingsController.getAll(req, res, next)
})

router.get('/settings/:id',[Guard.isValidUser], (req, res, next) => {
    SystemSettingsController.getOne(req, res, next)
})

router.post('/mail/create',[Guard.isValidAdmin], (req, res, next) => {
    MailSettingsController.create(req, res, next)
})

router.get('/mail/all',[Guard.isValidUser], (req, res, next) => {
    MailSettingsController.getAll(req, res, next)
})

router.get('/activities', [Guard.isValidUser], (req, res, next) => {
    ActivityController.getAll(req, res, next)
})

router.get('/incomming/message',(req,res,next) =>{
    ExtraController.userSmsResponse(req,res,next)
})

router.get('/all/gmail/message',[Guard.isValidUser], (req, res, next) => {
    ExtraController.userEmailResponse(req, res, next)
})

router.get('/responses',[Guard.isValidUser], (req, res, next) => {
    ExtraController.getResponse(req, res, next)
})

router.get('/archieves',[Guard.isValidUser], (req, res, next) => {
    ExtraController.getArchieve(req, res, next)
})

router.post('/email_alert', (req, res, next) => {
    ExtraController.emailAlert(req, res, next)
})

router.get('/unsubscribe/:email', (req, res, next) => {
    ExtraController.deactivateAlertEmail(req, res, next)
})

router.get('/all/count',[Guard.isValidUser], (req, res, next) => {
    ExtraController.countAllDoc(req, res, next)
})

router.get('/my_activities/:user_id', [Guard.isValidUser], (req, res, next) => {
    ActivityController.getuserAll(req, res, next)
})

router.get('/my_recent_activities/:user_id', [Guard.isValidUser], (req, res, next) => {
    ActivityController.getuserLastFive(req, res, next)
})

router.post('/contact/create', (req, res, next) => {
    ContactController.create(req, res, next)
})

router.post('/notifications/token', (req, res) => {
    console.log(req.body);
    Activity.saveToken(req.body.token.value);
    console.log(`Received push token, ${req.body.token.value}`);
    return res.send(`Received push token, ${req.body.token.value}`);
});
  
router.post('/notifications/message', (req, res) => {
    Activity.handlePushTokens(req.body.title, req.body.message, req.body.user_id);
    console.log(`Received message, ${req.body.message}`);
    return res.send(`Received message, ${req.body.message}`);
});

router.get('/contact/all', (req, res, next) => {
    ContactController.getAll(req, res, next)
})

router.get('/', (req, res, next) => {
    res.send("Welcome to Beauty API visit <a href='https://servemeserviceapp.herokuapp.com/'>QAPP</a> for the interface.")
})

module.exports = router