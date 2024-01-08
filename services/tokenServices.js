const express = require('express');
const router = express.Router();
const { generateRefreshToken, generateAccessToken } = require('../utils/tokenGeneration');
const RefreshToken = require('../models/refreshTokenSchema');



exports.refreshToken= async (req, res) => {
    const { refreshToken } = req.body;

    try {
        // Validate the refresh token
        const tokenRecord = await RefreshToken.findOne({ token: refreshToken }).populate('user').populate('client');
        if (!tokenRecord) {
            return res.status(400).json({ message: 'Invalid refresh token.' });
        }

        // Check if the refresh token has expired
        if (new Date() > tokenRecord.expirationTime) {
            return res.status(400).json({ message: 'Refresh token has expired.' });
        }

        // Generate a new access token
        const newAccessToken = await generateAccessToken(tokenRecord.user, tokenRecord.client);

        // Optionally, issue a new refresh token and revoke the old one
        const newRefreshToken = await generateRefreshToken(tokenRecord.user, tokenRecord.client);
        await RefreshToken.deleteOne({ _id: tokenRecord._id });

        // Send the new tokens to the client
        res.json({
            accessToken: newAccessToken.token,
            expiresIn: newAccessToken.expiresIn,
            refreshToken: newRefreshToken.token
        });

    } catch (error) {
        console.error(error); // Log the error for server-side debugging
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = router;
