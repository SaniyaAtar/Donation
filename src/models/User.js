// src/models/User.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    referralCode: {
        type: String,
        unique: true, // Ensure uniqueness
    },
    totalDonations: {
        type: Number,
        default: 0,
    },
    donorDetails: [{
        name: String,
        amount: Number,
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    // Add any other user fields you need
});

export default mongoose.models.User || mongoose.model('User', userSchema);
