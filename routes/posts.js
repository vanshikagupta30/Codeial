const express = require ('express');
const router = express.Router();
const passport = require('passport');



const postsController = require('../controllers/posts_controller');


// router.post('/create',postsController.create);
router.post('/create',passport.checkAuthentication, postsController.create);
//this router is create is to destroy or delete the comments
router.get('/destroy/:id', passport.checkAuthentication, postsController.destroy);


module.exports = router;