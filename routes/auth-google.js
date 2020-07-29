const router = require('express').Router();
const passport = require('passport')

// auth with google+
//will do a google authentication whose strategy is definedin config folder and imported in app.js
//scope takes what kind of data we want to use
router.get('/', passport.authenticate('google', {
    scope: ['profile']
}));

//when logging first time the above url is executed which calls the passport-setup new Strategy 
//which gives a code in the url which can be used to get user data and then redirects to below mentioned code
//when this is fired we again use authentication which calls the callback function of passport-setup where
//we grab user data add it to cookie and other shits and stuff is done
router.get('/redirect', passport.authenticate('google', { failureRedirect: '/auth/login' }), (req, res) => {
    res.redirect('/profile/')
    // res.send('logged in with google' + req.user);
});

module.exports = router;