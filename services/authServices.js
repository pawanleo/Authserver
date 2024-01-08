const OTP = require('../models/otpSchema');
const User = require('../models/userSchema');
const server = require('../utils/oauth2server');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../utils/sendMail');


// POST /request-otp
// Users call this endpoint with their email to receive an OTP for login
exports.requestLoginOTP = async (req, res) => {
console.log(req.query)
    const { email } = req.body;
  
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
  
    // Generate a 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
    // Save the OTP with an expiration time (e.g., 10 minutes)
    const otpRecord = new OTP({
      email,
      otp,
      expirationTime: new Date(Date.now() + 10 * 60000),
    });
    await otpRecord.save();
  
    // Send the OTP to the user's email
    try {
      await sendOTPEmail(email, otp); // Send OTP to the user's email
      // Store the email in the session to use it during OTP verification
    
      // Render the OTP verification page
      res.render("verifyOtp", { email: email });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error sending OTP. Please try again.");
    }
  };
  
  exports.verifyLoginOtp = async (req, res) => {
    const { email, otp, redirect } = req.body;
 
  const client_id ="54095353-9857-4d4b-851c-fb5d2655d16b"
    try {
      // Find the OTP record
      const otpRecord = await OTP.findOne({ email, otp });
      if (!otpRecord) {
        return res.status(400).json({ message: "Invalid OTP." });
      }
  
      // Check if the OTP has expired
      if (otpRecord.expirationTime < new Date()) {
        await OTP.deleteOne({ _id: otpRecord._id }); // Clean up expired OTP
        return res.status(400).json({ message: "Expired OTP." });
      }
  
      // Find the user associated with the email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found." });
      }
  
      // Delete the OTP record as it's no longer needed
      await OTP.deleteOne({ _id: otpRecord._id });
  
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
        // Set the token as an HTTP-only cookie
        res.cookie('jwt', token, {
          httpOnly: true,
          secure: true, // Set to true if using HTTPS, which is recommended
          maxAge: 3600000 // Cookie expiration to match the token
      });
      
      // const oauthParams = new URLSearchParams({ client_id }).toString();
      const redirectTo = `/oauth/auth/authorize?client_id=${client_id}&response_type=code`;

      // Redirect the user back to /auth/authorize
      res.redirect(redirectTo);
      // Optionally, you can return the token in the response if needed
      // res.json({ message: 'OTP verified successfully.', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error verifying OTP." });
    }
  };
  

