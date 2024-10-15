// models/Donation.js
import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    referralCode: { type: String, required: true },
    donorName: { type: String, required: true }, // The name of the person making the donation
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Donation || mongoose.model('Donation', DonationSchema);
