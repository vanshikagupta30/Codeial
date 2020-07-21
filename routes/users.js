const express = require ('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

//for profile page
router.get('/profile/:id',passport.checkAuthentication, usersController.profile);
router.post('/update/:id',passport.checkAuthentication, usersController.update);


// for Forgot password
router.get('/forgot-password',usersController.forgotPassword);

// for reset password
router.post('/reset-password',usersController.resetPassword);

// email directed reset password link
router.get('/reset-password/:id',usersController.resetPasswordPage);

// update password
router.post('/reset-password/:id',usersController.updatePassword);



//for sign-in or sign-up page
router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);

//for user sign-up (or below) is for sign-in
router.post('/create', usersController.create);
// router.post('/create-session', usersController.createSession);

//use passport as a middleware to authenticate
//ye vala passport se lekr aya h ab ye 2 arguments ni lega upr k jaise 3 lega bcoz passport is a middleware, first the router comes to /create-session, if passport authentication is done by user then next function is  called.. if it is not done then it is redirect to /users/sign-in page
// router.post('/create-session',{failureRedirect: '/users/sign-in'},usersController.createSession);
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
), usersController.createSession);

router.get('/sign-out',usersController.destroySession);


// isme jo hmne path diya h vo hmne passport=oauth vali js file m callback k andr likha tha ki usre k andr auth/google h
////this is the URL I'll send the data to google(scope k andr hmne vo define ki h jo hme chaiye)
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
////this is the URL I'll receive te data from google
router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/users/sign-in'
}), usersController.createSession);


module.exports = router;  