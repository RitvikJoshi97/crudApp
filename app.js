const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const mongoose = require('mongoose')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const connectDB = require('./config/db')
const MongoStore = require('connect-mongodb-session')(session)
//cosnt MongoStore = require('connect-mongo')(session)
//const { connect } = require('mongoose')

// LOAD CONFIG 
dotenv.config({ path: './config/config.env' })

// PASSPORT CONFIG
require('./config/passport')(passport)

connectDB()

const app = express()

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


// LOGGING
if (process.env.NODE_ENV === 'dev'){
    app.use(morgan('dev'))
}

// HBS - helpers
const { formatDate } = require('./routes/helpers/hbs')

// HBS - middleware
app.engine('.hbs', exphbs({helpers:{
    formatDate,
},defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs')

// SESSIONS 
app.use(
    session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        uri: process.env.MONGO_URI,
        collection: 'sessions'
        //clientPromise: clientP
        //mongoUrl: mongoose.connection.db
        //mongoUrl: mongoose.connection.client.s.url
    })//({ mongooseConnection: mongoose.connection})
    //cookie: {secure: true} //requires HTTPS
}))


// PASSPORT MIDDLEWARE
app.use(passport.initialize())
app.use(passport.session())


// STATIC FOLDER
app.use(express.static(path.join(__dirname,'public')))

// ROUTES
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/datas', require('./routes/datas'))
 

PORT = process.env.PORT || 3000 
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`))
