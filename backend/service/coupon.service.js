const getClientIP = (req) => {
    const forwardedIps = req.headers['x-forwarded-for'];
    if (forwardedIps) {
        // x-forwarded-for can contain multiple IPs, the first one is the real client's IP
        return forwardedIps.split(',')[0];  // The first IP in the list is the real client's IP
    } else {
        return req.ip === '::1' ? '127.0.0.1' : req.ip;  // If localhost, return 127.0.0.1 for local dev
    }
};

module.exports =  getClientIP ;