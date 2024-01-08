const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "lakshya.webdev@gmail.com",
      pass: " vvnm ynvf jmnr gzgl",
    },
  });

// Helper function to send OTP via email
async function sendOTPEmail(email, otp) {
    const mailOptions = {
        from: 'pawansinghrathore0708@gmail.com',
        to: email,
        subject: 'Your OTP',
        text: `Your OTP is: ${otp}`
    };

    await transporter.sendMail(mailOptions);
}
module.exports={sendOTPEmail}