const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('Router Loaded');
//comment// isse pta chlega ki hmara router chl rha h ya ni

router.get('/',homeController.home);

// this means thar whenever the path is for '/users' then we can just require my neighbour which is './users'
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/likes', require('./likes'));
router.use('/friends', require('./friends'));

// ye index.js find krega api ko then api (index) v1 k index ko then v1 post ko within v1 and then posts k andr controller api m posts di hui h vo use
router.use('/api', require('./api'));

//comment// for any further routes, access from here
// router.use('/routerName', require('./routerfile));

module.exports = router;
//comment// I want to export this to be availabe in another index.js file