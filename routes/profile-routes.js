const router = require('express').Router()

//a middleware created to check if user is logged in or not
const authCheck = (req,res,next) => {
    if (!req.user) {
        //if user is not logged in
        res.redirect('/auth/login')
    } else {
        //if user is logged in
        //next means go to next middleware or function
        //here it will be next (req,res) thig
        next()
    }
}

router.get('/',authCheck, (req,res) => {
    //res.send("Logged in. This is your profile" + req.user)
    res.render('profile', { user: req.user })
})

module.exports = router