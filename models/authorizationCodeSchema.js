const mongoose = require('mongoose');

const authorizationCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, index: true },
    redirectUri: { type: String, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    expiresIn: { type: Date, required: true }
}, { timestamps: true });
const AuthorizationCode= mongoose.model('AuthorizationCode', authorizationCodeSchema);
module.exports =AuthorizationCode
