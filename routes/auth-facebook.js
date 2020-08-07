const router = require('express').Router();
const passport = require('passport')

//auth with facebook
router.get('/', passport.authenticate('facebook'));

router.get('/redirect', passport.authenticate('facebook'), (req, res) => {
    res.redirect('/profile/')
    //res.send('logged in with google' + req.user);
});

module.exports = router;