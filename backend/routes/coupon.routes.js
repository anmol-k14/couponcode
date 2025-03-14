const express = require('express');
const router = express.Router(); 
const preventAbuseMiddleware = require('../middleware/coupon.middleware')
const couponController =require('../controller/coupon.controller')


router.post('/claim',preventAbuseMiddleware,couponController);

module.exports = router;  