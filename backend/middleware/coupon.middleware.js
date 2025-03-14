const getClientIP=require('../service/coupon.service')
const IpClaim = require('../models/IpClaim'); 

const preventAbuse = async (req, res, next) => {

    const ipAddress = getClientIP(req);


    console.log(ipAddress);

    const ipClaim = await IpClaim.findOne({ ipAddress });

    if (ipClaim) {
        const lastClaimTime = ipClaim.lastClaimedAt;
        const now = new Date();
        const timeDiff = now - lastClaimTime; 
        const oneHour = 60 * 60 * 1000;  
        
        if (timeDiff < oneHour) {
            return res.status(403).json({
                message: `You have already claimed so you need to wait ${(Math.ceil((oneHour - timeDiff) / 60000))} minutes before claiming another coupon.`
            });
        }
    }
    

    next();
};

module.exports = preventAbuse;