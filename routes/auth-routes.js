const router = require('express').Router();
const passport = require('passport')

// auth login
router.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    //this basically destroys the cookie created to keep track of user authentication
    //even after a day the cookie is destroyed because we defined its life to be of a day
    req.logout()
    res.redirect('/');
});

// auth with google+
//will do a google authentication whose strategy is definedin config folder and imported in app.js
//scope takes what kind of data we want to use
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

//when logging first time the above url is executed which calls the passport-setup new Strategy 
//which gives a code in the url which can be used to get user data and then redirects to below mentioned code
//when this is fired we again use authentication which calls the callback function of passport-setup where
//we grab user data add it to cookie and other shits and stuff is done
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile/')
    //res.send('logged in with google' + req.user);
});

module.exports = router;