const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    clientId: { type: String, required: true, unique: true, index: true },
    clientSecret: { type: String, required: true },
    redirectUri: { type: String, required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Client=mongoose.model('Client', clientSchema);
module.exports = Client
