import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    referralCode: { type: String, unique: true }, // Ensure referral code is unique
    totalDonations: { type: Number, default: 0 }, // Optional, if tracking donations
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
