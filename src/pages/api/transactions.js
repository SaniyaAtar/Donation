// src/pages/api/transactions.js
import dbConnect from '../../../src/utils/dbConnect';
import Donation from '../../../src/models/Donation';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const donations = await Donation.find().sort({ createdAt: -1 }); // Fetch donations, sorted by most recent
            res.status(200).json(donations);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching donations', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
