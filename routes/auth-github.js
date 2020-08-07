const router = require('express').Router();
const passport = require('passport')

//auth with github
router.get('/', passport.authenticate('github'));

router.get('/redirect', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/profile/')
    //res.send('logged in with google' + req.user);
});

module.exports = router;