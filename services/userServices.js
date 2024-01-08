const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const OTP = require("../models/otpSchema");
const User = require("../models/userSchema");
const { sendOTPEmail } = require("../utils/sendMail");

// User registration endpoint with validation
exports.regiserUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const newUser = new User({ email, isEmailVerified: false, role });
    await newUser.save();

    const otp = uuidv4().slice(0, 6); // Generate a 6-character OTP
    const newOTP = new OTP({ email, otp });
    await newOTP.save();

    await sendOTPEmail(email, otp);

    res.json({
      message: "Registration successful. Please check your email for the OTP.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.verifyOTP = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    await User.findOneAndUpdate({ email }, { isEmailVerified: true });
    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({ message: "Email verification successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

