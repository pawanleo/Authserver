const crypto = require('crypto');
const AccessToken = require('../models/accessTokenSchema');
const RefreshToken = require('../models/refreshTokenSchema');


const generateToken = () => crypto.randomBytes(32).toString('hex');

const generateAccessToken = async (user, client) => {
    const tokenValue = generateToken();
    const expiresIn = new Date(Date.now() + process.env.ACCESS_TOKEN_LIFETIME);

    const accessToken = new AccessToken({
        token: tokenValue,
        user: user.id,
        client: client.id,
        expiresIn
    });

    await accessToken.save();
    return accessToken;
};

const generateRefreshToken = async (user, client) => {
    const tokenValue = generateToken();

    const refreshToken = new RefreshToken({
        token: tokenValue,
        user: user.id,
        client: client.id
    });

    await refreshToken.save();
    return refreshToken;
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
};
