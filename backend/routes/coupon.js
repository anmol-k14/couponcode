const express = require('express');
const router = express.Router();
// const Coupon = require('../models/Coupon');
// const IpClaim = require('../models/IpClaim'); 

let couponList = [];  // Array to hold coupons (could be fetched from DB)
let currentIndex = 0; // To maintain round-robin index

const initializeCoupons = () => {
    couponList = ['Coupon1', 'Coupon2', 'Coupon3', 'Coupon4', 'Coupon5','Coupon6', 'Coupon7', 'Coupon8', 'Coupon9', 'Coupon10']; 
    currentIndex = 0;
};

initializeCoupons();  // Initialize the coupons

// Middleware to prevent abuse based on IP and cookies
// const preventAbuse = async (req, res, next) => {
//     const userIP = req.ip;
//     console.log(userIP)
//     const userCookie = req.cookies.userClaimed;
//     console.log(req.cookies)
    

//     // If the user has claimed before, send a message
//     if (userCookie) {
//         const lastClaimTime = new Date(userCookie.timestamp);
//         const now = new Date();
//         const timeDiff = now - lastClaimTime;
//         const oneHour = 60 * 60 * 1000; // 1 hour

//         if (timeDiff < oneHour) {
//             return res.status(403).json({
//                 message: `Please wait ${Math.ceil((oneHour - timeDiff) / 60000)} minutes before claiming another coupon.`
//             });
//         }
//     }

//     // Allow claim if no abuse detected
//     next();
// };

const getClientIP = (req) => {
    const forwardedIps = req.headers['x-forwarded-for'];
    if (forwardedIps) {
        return forwardedIps.split(',')[0];
    } else {
        return req.ip === '::1' ? '127.0.0.1' : req.ip;  // If localhost, return 127.0.0.1 for local dev
    }
};

const preventAbuse = async (req, res, next) => {
    // const userIP = req.ip;
    const ipAddress = getClientIP(req);

    const userCookie = req.cookies.userClaimed;

    console.log(ipAddress);
    // Check if the user has claimed a coupon recently from this IP in the database
    const ipClaim = await IpClaim.findOne({ ipAddress });

    if (ipClaim) {
        const lastClaimTime = ipClaim.lastClaimedAt;
        const now = new Date();
        const timeDiff = now - lastClaimTime;  // Time difference in ms
        const oneHour = 60 * 60 * 1000;  // 1 hour in ms
        
        if (timeDiff < oneHour) {
            return res.status(403).json({
                message: `You need to wait ${(Math.ceil((oneHour - timeDiff) / 60000))} minutes before claiming another coupon.`
            });
        }
    }
    
    // Allow claim if no abuse detected
    next();
};

// Route to claim a coupon
router.post('/claim', preventAbuse, async (req, res) => {
    
    if (couponList.length === 0) {
        return res.status(404).json({ message: 'No coupons left to claim' });
    }

    const coupon = couponList[currentIndex];
    currentIndex = (currentIndex + 1) % couponList.length;

    const ipAddress = getClientIP(req);

    const newCoupon = new Coupon({
        code: coupon,
        assignedTo: ipAddress,
        claimTimestamp: new Date()
    });


    await newCoupon.save();

    await IpClaim.findOneAndUpdate(
        { ipAddress },
        { lastClaimedAt: new Date() },
        { upsert: true } // Creates a new document if no match is found
    );

    // Set cookie to track claim
    res.cookie('userClaimed', { timestamp: new Date() }, { maxAge: 3600 * 1000 });

    res.json({ message: 'Coupon claimed successfully', coupon: coupon });
});

module.exports = router;
