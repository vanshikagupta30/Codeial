const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');
const friendController = require('../controllers/friends_controller');




router.get('/add-friend', friendController.addFriend);


module.exports = router;
//comment// I want to export this to be availabe in another index.js file