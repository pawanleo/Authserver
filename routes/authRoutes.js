const express = require("express");
const passport = require("passport");
require("../utils/passport-config"); // Your Passport JWT strategy configuration
const Client = require("../models/clientSchema");
const server = require("../utils/oauth2server");

const {
  isAuthenticated,
  validateAuthorizationRequest,
} = require("../middlewares/authMiddleware");
const { default: rateLimit } = require("express-rate-limit");
const { requestLoginOTP, verifyLoginOtp } = require("../services/authServices");
const router = express.Router();
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 refresh requests per windowMs
});
// Authorization endpoint
router.get(
  "/auth/authorize",
  isAuthenticated,
  validateAuthorizationRequest,
  server.authorize(async (clientId, redirectUri, done) => {
    try {
        const client = await Client.findOne({ clientId: clientId });

        if (!client) {
            return done(null, false); // client not found
        }
 
        return done(null, client, client.redirectUri); // client found
    } catch (err) {
        return done(err); // error occurred
    }
}),
server.decision((req, done) => {
  // Automatically approve the authorization request
  done(null, { allow: true });
})
);

// User decision on consent
// Handle user's decision on consent screen
// router.post("/auth/authorize/decision", isAuthenticated, server.decision());

// Token endpoint
router.post(
  "/auth/token",
  passport.authenticate(["basic"], {
    session: false,
  }),
  server.token(),
  server.errorHandler()
);
// router.post("/auth/token/refresh", refreshLimiter, refreshToken);
//login routes
router.get("/login", (req, res) => {
  res.render("login"); // Render 'login.ejs' from the views directory
});
router.get("/verify-otp", (req, res) => {
  res.render("verifyOtp"); // Render 'login.ejs' from the views directory
});
router.post("/request-login-otp", requestLoginOTP);
router.post("/verify-login-otp", verifyLoginOtp);

module.exports = router;
