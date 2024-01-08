const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: '5m' } }, // OTP expires after 5 minutes
  
}, { timestamps: true });
const OTP =mongoose.model('OTP', otpSchema);
module.exports = OTP
