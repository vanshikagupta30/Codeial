// this index.js is similar to index and post js file of routes

const express = require('express');

const router = express.Router();

router.use('/posts', require('./posts'));
router.use('/users', require('./users'));


module.exports = router;