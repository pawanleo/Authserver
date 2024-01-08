const express = require("express");
const { registerClient } = require("../services/clientServices");
const {
  regiserUser,
  verifyOTP,

} = require("../services/userServices");
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/register-user",
  body("email").isEmail().withMessage("Invalid email format"),
  regiserUser
);
router.post(
  "/verify-otp",
  body("email").isEmail().withMessage("Invalid email format"),
  body("otp")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 characters long"),
  verifyOTP
);



module.exports = router;
