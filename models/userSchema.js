const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    isEmailVerified: { type: Boolean, default: false },// 
    role: { 
        type: String, 
        enum: ['user', 'admin', 'manager'], 
        required:true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
},{ timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User
