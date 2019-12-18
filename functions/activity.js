const ActivityLog = require('../Modules/Site/Models/ActivityLog')
const EmailAlert = require('../Modules/Site/Models/Email')
const User = require('../Modules/User/Models/User')
const request = require('request')
var nodemailer = require("nodemailer")
var sgTransport = require("nodemailer-sendgrid-transport")
var NodeGeocoder = require('node-geocoder')
const config = require('../beauty.json')

var options = {
    auth: {
        api_user: process.env.SENDGRID_USERNAME,
        api_key: process.env.SENDGRID_PASSWORD
    },    
}
 var africastalking  = {
    apiKey: 'f39adb22724c3c6686c19dce339dcb3e5344bb412512b294193c27139f5a0b93', //         // use your sandbox app API key for development in the test environment
    username: 'weserve',      // use 'sandbox' for development in the test environment
}

let client = nodemailer.createTransport(sgTransport(options))

var fs = require('fs')
const Activity = {}
var result = {}
var trans
var data = {}


Activity.getDecode= function(user = '',address){
    var options = {
        provider: 'google',
       
        // Optional depending on the providers
        httpAdapter: 'https', // Default
        apiKey: 'AIzaSyDECOtEW9X3ctXS7lg3Xh_4rCrV2ervJf0', // for Mapquest, OpenCage, Google Premier
        formatter: null         // 'gpx', 'string', ...
    }
       
    var geocoder = NodeGeocoder(options)
    geocoder.geocode(address).then(function(res) {
        console.log(res[0].latitude);
        if(user != '')
            user.country = res[0].country
            user.city = res[0].city
            user.latitude = res[0].latitude
            user.longitude = res[0].longitude
            user.save()
            return res[0]
    }).catch(function(err) {
        // console.log(err);
        return ''
    })    
    
}


Activity.makeid = function(length) {
    var text = ""
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    for (var i = 0; i < length; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }console.log(text)
    return text
}

Activity.Sms = (to, message) => {
    
    const AfricasTalking = require('africastalking')(africastalking);

    sms = AfricasTalking.SMS

    // Use the service
    const options = {
        to: to,
        message: message,
        // from: 'ServeMe'
    }

    // Send message and capture the response or error
    sms.send(options).then( response => {   
        console.log(response); 
    })
    .catch( error => {
            console.log(error);
    });
}


Activity.Base64_encode = function(file) {
    // read binary data
    var bitmap = fs.readFileSync(file)
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64')
}


Activity.Email = function(data, subject, message) {
    try {
        var email = {
            from: config.app_name,
            to: (data.email) ? data.email : config.email,
            subject: subject,
            html: message
        }

        client.sendMail(email, function(err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log("Message sent: " + info.response)
            }
        })
    } catch (error) {
        return res.status(401).json({ "success": false, "message": error })
    }
}


Activity.html = function (data){
    return  '<div id="content" style="background-color: #1D4BB7;width:100%;">'+
                '<nav>'+
                    '<div class="container-fluid">'+
                            '<span><a href="#"><img src="https://servemeserviceapp.herokuapp.com/images/servme-logo-dark.png" style="width: 120px height: 45px padding:10px" class="img-responsive"></a></span>'+
                    '</div>'+
                '</nav>'+
                '<div style="background-color: #fefefe;padding:20px;color:#000;">'+ data + '</div>'+
            '</div>'
}

Activity.SupportEmail = function(data, subject, message) {
    try {
        var email = {
            from: config.app_name,
            to: (data.user_id) ? data.user_id.email : config.email,
            subject: subject,
            html: message
        }

        client.sendMail(email, function(err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log("Message sent: " + info.response)
            }
        })
    } catch (error) {
        return res.status(401).json({ "success": false, "message": error })
    }
}

Activity.BulkEmail = async(message) => {
    if (message.others !== '' && message.medium === 'email') {
        var str = message.others
        var str_array = str.split(',')

        for (var i = 0; i < str_array.length; i++) {
            // Trim the excess whitespace.
            str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "")
            // Add additional code here, such as:
            console.log(str_array[i])
            try {
                var email = {
                    from: config.app_name,
                    to: str_array[i],
                    subject: message.title,
                    html: this.html(message.message)
                }

                client.sendMail(email, function(err, info) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Message sent: " + info.response)
                    }
                })
            } catch (error) {
                console.log(error)
                // return res.status(401).json({ "success": false, "message": error })
            }
        }
    }
    if (message.receiver === 'subscribers'){
        this.Subscribers(message)
    } else if (message.receiver === 'all users'){
        this.Users(message)
    } else if (message.receiver === 'all') {
        this.Users(message)
        this.Subscribers(message)
    }else{
        User.find({ user_type: message.receiver }, null, { sort: { 'created_at': -1 } }, function(error, users) {
            if (error) return res.json(error)
            for (user of users) {
                try {
                    var email = {
                        from: config.app_name,
                        to: user.email,
                        subject: message.title,
                        html: this.html(message.message)
                    }

                    client.sendMail(email, function(err, info) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("Message sent: " + info.response)
                        }
                    })
                } catch (error) {
                    return res.status(401).json({ "success": false, "message": error })
                }
            }
        })
    }   
}

Activity.Subscribers = (message)=>{
    EmailAlert.find({ status: 1 }, null, { sort: { 'created_at': -1 } }, function (error, emails) {
        if (error) return res.json(error)
        for (user of emails) {
            try {
                var email = {
                    from: config.app_name,
                    to: user.email,
                    subject: message.title,
                    html: this.html(message.message)
                }

                client.sendMail(email, function (err, info) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Message sent: " + info.response)
                    }
                })
            } catch (error) {
                return res.status(401).json({ "success": false, "message": error })
            }
        }
    })
}

Activity.Users = (message) => {
    User.find({ deleted_at: null }, null, { sort: { 'created_at': -1 } }, function (error, users) {
        if (error) return res.json(error)
        for (user of users) {
            try {
                var email = {
                    from: config.app_name,
                    to: user.email,
                    subject: message.title,
                    html: this.html(message.message)
                }

                client.sendMail(email, function (err, info) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Message sent: " + info.response)
                    }
                })
            } catch (error) {
                return res.status(401).json({ "success": false, "message": error })
            }
        }
    })
}

Activity.activity_log = async(req, user_id, description) => {
    if (user_id) {
        let logs = new ActivityLog()
        logs.user_id = user_id
        logs.description = description
        logs.ip_address = req.header('x-forwarded-for') || req.connection.remoteAddress
        return logs.save()
    }
}

Activity.alertEmail = async (req) => {
    if (req) {
        let alert = new EmailAlert()
        alert.email = req.body.email
        alert.ip_address = req.header('x-forwarded-for') || req.connection.remoteAddress
        return alert.save()
    }
}

Activity.Transaction = async(req, res, type) => {
    var options = {
        method: 'POST',
        json: true,
        url: 'https://api.paystack.co/transaction/verify/' + req.body.reference,
        headers: {
            'Authorization': 'Bearer ' + config.paystack_test_secret_key
        }
    }
    request.get(options, (err, body) => {
        if (err) return res.json(err)
        data.transaction = body.body
        trans = new Payment()
        trans.type = type
        trans.reference = req.body.reference
        trans.user_id = req.body.user_id
        trans.status = body.body.data.status
        trans.message = body.body.message
        trans.fees = body.body.data.fees / 100
        trans.fees_split = body.body.data.fees_split / 100
        trans.amount = body.body.data.amount / 100
        trans.save()
        return result.transaction = trans
    })
}


module.exports = Activity