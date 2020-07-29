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

module.exports = router;