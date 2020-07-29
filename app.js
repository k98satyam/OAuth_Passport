const express = require('express');
const authRoutes = require('./routes/auth-routes');
const googleRoutes = require('./routes/auth-google');
const facebookRoutes = require('./routes/auth-facebook');
const githubRoutes = require('./routes/auth-github');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup')
const mongoose = require('mongoose')

//a package named session-cookie is initialized 
//so that we can controll our user session in our app 
const cookieSession = require('cookie-session');
const passport = require('passport');

const app = express();

//initialize cookie-Session
//takes a parameter max age in milli sec, basically how long it will be present
//and a keys property which is used to encrypt data, can have multiple values
//after that send it to browser
//and we dont want to send cookie in plain text so we encrypt it and when it comes back we can decrypt it if needed 
app.use(cookieSession({
    //a day
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.PASSPORT_KEY]
}))

//we then initialize passport and tell it use session-cookies
app.use(passport.initialize())
app.use(passport.session())

// set view engine
app.set('view engine', 'ejs');


//mongoDB
mongoose.connect(process.env.MONGO_URI,{ useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => {
        console.log("Mongoose Connected")
        app.listen(3000, () => {
            console.log('app now listening for requests on port 3000');
        });
    })
    .catch(err => console.log(err))

// set up routes
app.use('/auth', authRoutes);
app.use('/auth/google', googleRoutes);
app.use('/auth/facebook', facebookRoutes);
app.use('/auth/github', githubRoutes);
app.use('/profile', profileRoutes);

// create home route
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});

