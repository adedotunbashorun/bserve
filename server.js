var express = require('express')
var morgan = require('morgan')
var bodyParser = require('body-parser')
var path = require('path')
var mongoose = require('mongoose')
const formData = require("express-form-data")
const os = require("os")
let cors = require('cors')
require('dotenv').config()
const Sentry = require('@sentry/node')
Sentry.init({ dsn: 'https://9ca7c97ac6734c5eb608f7b5da902eff@sentry.io/1492131' })
const config = require('./config')

const app = express()

var passport = require('passport')

const port = config.app.port

// splitInteger(312,19)
// splitInteger(4000,37)

try {
    mongoose.set('useCreateIndex', true)
    mongoose.connect(config.db.url, { useNewUrlParser: true }).then(() => { // if all is ok we will be here
        console.log("connected")
    }).catch(err => { // we will not be here...
        console.error('App starting error: Network Issue')
        return { error: err.stack, message: "Error Connecting to mongo db" }
        process.exit()
    })
} catch (err) {
    console.log(err)
}

require('./passport-config')

const options = {
    uploadDir: os.tmpdir(),
    autoClean: true
}

app.use(passport.initialize())
app.use(passport.session())

app.use(cors({
    origin: ['http://localhost:3000','https://servemeserviceapp.herokuapp.com','http://servemeserviceapp.herokuapp.com'],
    credentials: true
}))

app.use(morgan('dev'))


app.use('/uploads', express.static(path.join(__dirname,'uploads')))

const authRoutes = require('./Modules/Authentication/Routes')
const bulkRoute = require('./Modules/BulkMessage/Routes')
const userRoutes = require('./Modules/User/Routes')
const notificationRoute = require('./Modules/Notifications/Routes')
const errorsRoute = require('./Modules/Errors/Routes')
const siteRoutes = require('./Modules/Site/Routes')
const categoryRoutes = require('./Modules/Category/Routes')
const classRoutes = require('./Modules/Class/Routes')
const subcategoryRoutes = require('./Modules/SubCategory/Routes')
const supportRoutes = require('./Modules/Support/Routes')
const orderRoutes = require('./Modules/Job/Routes')

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: false }))
// parse data with connect-multiparty. 
app.use(formData.parse(options));
// clear from the request and delete all empty files (size == 0)
app.use(formData.format());
// change file objects to stream.Readable 
app.use(formData.stream());
// union body and files
app.use(formData.union());
// process.kill(process.pid)


app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', siteRoutes)
app.use('/api', categoryRoutes)
app.use('/api', classRoutes)
app.use('/api', subcategoryRoutes)
app.use('/api', bulkRoute)
app.use('/api', supportRoutes)
app.use('/api', notificationRoute)
app.use('/api', errorsRoute)
app.use('/api', orderRoutes)

app.use('/', siteRoutes)

//set static folder
// app.use(express.static(path.join(__dirname, '/dist')))



app.set('port',port)

module.exports = app