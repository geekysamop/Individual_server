const express = require('express');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');
const helmet = require("helmet");
const fs = require('fs')
const https = require('https')
const { default: mongoose } = require('mongoose');
const User = require('./database');
var flash = require('connect-flash');
const ejs = require('ejs');
const passport = require('passport');
const { initializingPassport, isAuthenticated } = require('./passportConfig');
const expressSession = require("express-session")

var sslOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
    passphrase: 'samarth'
    };

mongoose.connect('mongodb+srv://samarth:Samarth123@cluster0.obcyplu.mongodb.net/mydb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Successfully connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

initializingPassport(passport);

const app = express();

const web = `${__dirname}/web`;
const activities = `${__dirname}/activities`;
const resources = `${__dirname}/resources`;

const port = 3000;

app.use(helmet.dnsPrefetchControl());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.originAgentCluster());
app.use(helmet.hsts());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.use(flash())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressSession({secret:"secret",resave:false,saveUninitialized:false}))
app.use(passport.initialize())
app.use(passport.session())

app.set("view engine","ejs");



app.get('/welcome',ensureAuthenticated,(req, res) => {
    res.sendFile(`${web}/welcome.html`)
});

app.get('/app.js',ensureAuthenticated,  (req, res) => {
    res.sendFile(`${web}/app.js`)
});
app.get('/web/app.js',ensureAuthenticated,  (req, res) => {
    res.sendFile(`${web}/app.js`)
});

app.get('/web/devices-list',ensureAuthenticated,  (req, res) => {
    res.sendFile(`${web}/devices-list.html`)
});
app.get('/web/sdata',ensureAuthenticated,  (req, res) => {
    res.sendFile(`${web}/sensordata.html`)
});
app.get('/web/chart',ensureAuthenticated,  (req, res) => {
    res.sendFile(`${web}/chart.html`)
});

app.get('/web/add',ensureAuthenticated,  (req, res) => {
    res.sendFile(`${web}/add-device.html`)
});

app.get('/activities/lighting',ensureAuthenticated,  (req, res) => {
    res.sendFile(`${activities}/lighting.html`)
});

app.get('/activities/air-conditioning',ensureAuthenticated, (req, res) => {
    res.sendFile(`${activities}/air-conditioning.html`)
});

app.get('/activities/security',ensureAuthenticated,  (req, res) => {
    res.sendFile(`${activities}/security.html`)
});

app.get('/resources/styles.css',ensureAuthenticated,  (req, res) => {
    res.sendFile(`${resources}/styles.css`)
});

app.get('/register',  (req,res)=>{
    res.render("register");
});

app.get('/',  (req,res)=>{
    res.render("page");
});

app.get('/login', (req,res)=>{
    res.render("login");
})

app.post('/register', async(req, res) => {
    const user = await User.findOne({username:req.body.username});

    if(user) return res.status(400).send("user already exist! ");

    const newUser = await User.create(req.body);
    res.status(201).send(newUser);
})

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/register',
    failureFlash: true
  }), function(req, res) {
    // Redirect to homepage on success
    res.redirect('/welcome');
  });

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      // If user is authenticated, call next to proceed to the next middleware function
      return next();
    } else {
      // If user is not authenticated, redirect to the login page
      req.flash('error_msg', 'Please log in to view this page');
      res.redirect('/login');
    }
  }

  var server = https.createServer(sslOptions, app).listen(port, function(){
    console.log("Express server listening on port https://localhost:" + port);
    });
// app.listen(port, () => {
//     console.log(`Server listening at http://localhost:${port}`);
// });