const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
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

passport.use(
    new GoogleStrategy({
        //this just means that we can use google for connecton using the following options

        //options for google strategy
        //this was created from google developer console
        //create a project, enable api, find google+ api and create a clientID and api keys from create credentials
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRETE,

        //in the redirect path when creating the following credentials,
        //redirect means the page that will be opened after clicking allow on google confirmation page
        //we need to mention the redirect url here also 
        callbackURL: '/auth/google/redirect',

    }, (accessToken, refreshToken, profile, done) => {
        //passport callback option
        // console.log("profile info :-")
        console.log(profile)
        User.findOne({ googleId : profile.id })
            .then(currentUser => {
                if(currentUser) {
                    //if user already exists
                    console.log("already Exist : " + currentUser)
                    //this done method calls the serializeUser method
                    done(null,currentUser)
                }
                else {
                    //add new user
                    const user = new User({
                        username : profile.displayName,
                        googleId : profile.id,
                        thumbnail : profile._json.picture
                    })
                    user.save()
                        .then((newUser) => { 
                            console.log("New User " + newUser)
                            //this done method calls the serializeUser method
                            done(null,newUser)
                        })
                        .catch(err => console.log(err))
                }
            })
    })
)