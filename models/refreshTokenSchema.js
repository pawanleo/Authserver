const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    expiresIn: { type: Date, required: true }
});
const RefreshToken=mongoose.model('RefreshToken', refreshTokenSchema);
module.exports = RefreshToken
