// /src/models/Donation.js
import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  referralCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Donation || mongoose.model('Donation', DonationSchema);
