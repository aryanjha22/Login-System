const express = require('express');
const expressLayouts=require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash')
const session = require('express-session')

const app = express()

require('./config/passport')(passport);

//body parser
app.use(express.json());

//express-session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))

//passport initialisation
app.use(passport.initialize());
app.use(passport.session());

//flash-messages
app.use(flash());


// error handling and using in messages.ejs
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')

    next();
})

//mongo URI
const db = require('./config/keys').MongoURI

mongoose.connect(db, {useCreateIndex : true, useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => console.log('Mongo Server running...'))
    .catch(err => console.log(err));

//server running
const PORT = process.env.PORT||2000;  
app.listen(PORT, console.log(`Server is running on ${PORT}... `));

//body parser
app.use(express.urlencoded({extended:true}))

//requiring routes
app.use('/', require('./routes/login')) 
app.use(expressLayouts);

//view-engine for ejs
app.set('view engine', 'ejs');

//adding css in ejs files
app.use("/views",express.static(__dirname + "/views"));              

