const express = require('express');
const expressLayouts=require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash')
const session = require('express-session')

const app = express()

require('./config/passport')(passport);

app.use(express.json());

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


// errross
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')

    next();
})

const db = require('./config/keys').MongoURI

mongoose.connect(db, {useCreateIndex : true, useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => console.log('Mongo Server running...'))
    .catch(err => console.log(err));


const PORT = process.env.PORT||2000;  
app.listen(PORT, console.log(`Server is running on ${PORT} `));
app.use(express.urlencoded({extended:true}))


app.use('/', require('./routes/login')) 
app.use(expressLayouts);

app.set('view engine', 'ejs');

app.use("/views",express.static(__dirname + "/views"));              

