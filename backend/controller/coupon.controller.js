const Coupon = require('../models/coupon');  
const IpClaim = require('../models/IpClaim'); 
const getClientIP=require('../service/coupon.service')

let couponList = [];  
let currentIndex = 0; 

const initializeCoupons = () => {
    couponList = ['Coupon1', 'Coupon2', 'Coupon3', 'Coupon4', 'Coupon5','Coupon6', 'Coupon7', 'Coupon8', 'Coupon9', 'Coupon10']; 
    currentIndex = 0;
};

initializeCoupons(); 

console.log(couponList)
const claimcoupon = async (req, res) => {
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
        { upsert: true } 
    );


    res.cookie('userClaimed', { timestamp: new Date() }, { maxAge: 3600 * 1000 });

    res.json({ message: 'Coupon claimed successfully', coupon: coupon });
}

module.exports =  claimcoupon ;