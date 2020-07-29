const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const FacebookStrategy = require('passport-facebook')
const GithubStrategy = require('passport-github')
require('dotenv').config()
const User = require("../model/user-model")

//serializeUser, deserializeUser, and done are passportJS methods

//a package named session-cookie is installed in app.js and initialized 
//so that we can use session-cookie in our app 

//this method takes one piece of information from our record(mongoDB) and stuff it to a cookie
//here we take user's information and put it in a cookie and send it to the browser
//so that browser knows a user is logged in
//and that user is authenticated and can procede with its profile 
passport.serializeUser((user,done) => {
    //this done method calls the deserializeUser method
    done(null,user.id)
})

//this method is called by done of above method 
//and is used when a cookie comes back to the server
//when browser makes a request for a profile page(or any other page)
//we are going to recive the user id and deserialize it to grab the user profile
passport.deserializeUser((id,done) => {
    User.findById(id)
        .then((user) => {
            //this will attach the user object to req object
            //and send it back to the "/" route so that it can be handled in a route handler
            done(null,user)
        })
})

//google
passport.use(
    new GoogleStrategy({
        //this just means that we can use google for connecton using the following options

        //options for google strategy
        //this was created from google developer console
        //create a project, enable api, find google+ api and create a clientID and api keys from create credentials
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRETE,

        //in the redirect path when creating the following credentials,
        //redirect means the page that will be opened after clicking allow on google confirmation page
        //we need to mention the redirect url here also 
        callbackURL: '/auth/google/redirect',

    }, (accessToken, refreshToken, profile, done) => {
        //passport callback option
        // console.log("profile info :-")
        console.log(profile)
        User.findOne({ appId : profile.id })
            .then(currentUser => {
                if(currentUser) {
                    //if user already exists
                    console.log("already Exist Google : " + currentUser)
                    //this done method calls the serializeUser method
                    done(null,currentUser)
                }
                else {
                    //add new user
                    const user = new User({
                        username : profile.displayName,
                        appId : profile.id,
                        thumbnail : profile._json.picture,
                        appName : "Google"
                    })
                    user.save()
                        .then((newUser) => { 
                            console.log("New User Google" + newUser)
                            //this done method calls the serializeUser method
                            done(null,newUser)
                        })
                        .catch(err => console.log(err))
                }
            })
    })
)

//facebook
passport.use(
    new FacebookStrategy({
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.FB_APP_SECRET,
        callbackURL: '/auth/facebook/redirect', 
        //the following data will be retrived from facebook, not all data are given by default
        profileFields: ['id', 'displayName','name', 'photos', 'email']
    }, (accessToken, refreshToken, profile, done) => {
        //console.log(profile)
        User.findOne({ appId : profile.id })
            .then(currentUser => {
                if(currentUser) {
                    //if user already exists
                    console.log("already Exist Facebook : " + currentUser)
                    done(null,currentUser)
                }
                else {
                    //add new user
                    const user = new User({
                        username : profile.displayName,
                        appId : profile.id,
                        thumbnail : profile.photos[0].value,
                        appName : "Facebook"
                    })
                    user.save()
                        .then((newUser) => { 
                            console.log("New User Facebook" + newUser)
                            done(null,newUser)
                        })
                        .catch(err => console.log(err))
                }
            })
    })
)

//github
passport.use(
    new GithubStrategy({
        clientID: process.env.GIT_CLIENT_ID,
        clientSecret: process.env.GIT_CLIENT_SECRET,
        callbackURL: '/auth/github/redirect', 
    }, (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        User.findOne({ appId : profile.id })
            .then(currentUser => {
                if(currentUser) {
                    //if user already exists
                    console.log("already Exist Github : " + currentUser)
                    done(null,currentUser)
                }
                else {
                    //add new user
                    const user = new User({
                        username : profile.displayName,
                        appId : profile.id,
                        thumbnail : profile.photos[0].value,
                        appName : "Github"
                    })
                    user.save()
                        .then((newUser) => { 
                            console.log("New User Github" + newUser)
                            done(null,newUser)
                        })
                        .catch(err => console.log(err))
                }
            })
    })
)