import connectDB from '../../db'; // Import the connection function
import Donation from '../../models/Donation'; // Assume you have a Donation model

export default async function handler(req, res) {
  await connectDB(); // Connect to MongoDB

  if (req.method === 'POST') {
    const { referralCode } = req.body;

    // Fetch total donations from the database for the given referral code
    const totalDonations = await Donation.aggregate([
      { $match: { referralCode: referralCode } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.status(200).json({ totalDonations: totalDonations[0]?.total || 0 });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
