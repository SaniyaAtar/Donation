// src/pages/api/donate.js
import dbConnect from '../../../src/utils/dbConnect';
import Donation from '../../../src/models/Donation';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        const { name, amount, referral } = req.body;

        try {
            const donation = new Donation({ name, amount, referral });
            await donation.save();

            // Update user's total donations if necessary (add logic here)

            res.status(201).json({ message: 'Donation recorded successfully!' });
        } catch (error) {
            res.status(500).json({ message: 'Error recording donation', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
