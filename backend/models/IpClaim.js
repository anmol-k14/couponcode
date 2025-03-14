const mongoose = require('mongoose');

const ipClaimSchema = new mongoose.Schema({
    ipAddress: { type: String, required: true, unique: true },
    lastClaimedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('IpClaim', ipClaimSchema);
