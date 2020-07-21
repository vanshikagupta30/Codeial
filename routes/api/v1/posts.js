const express = require('express');

const router = express.Router();
const passport = require('passport');
// here we need the posts api controller
const postsApi = require('../../../controllers/api/v1/posts_api');


router.get('/', postsApi.index);
// This will put an authentication check over my passport(I set session to be false bcoz I donot want session cookie is generated)
router.delete('/:id', passport.authenticate('jwt',{session: false}), postsApi.destroy);
 
module.exports = router;