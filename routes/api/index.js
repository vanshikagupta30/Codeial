// this is the root index for API routes(hmne ye API k index file m isliye likha taki hm sari routes ko yha se access kr sake)
const express = require('express');

const router = express.Router();


router.use('/v1', require('./v1'));

module.exports = router;