// src/pages/api/dashboard.js

import { getSession } from 'next-auth/react';
import dbConnect from '../../../src/utils/dbConnect'; // Adjust the path as needed
import User from '../../../src/models/User'; // Adjust the path as needed
import generateReferralCode from '../../../src/utils/generateReferralCode'; // Adjust the path as needed

export default async function handler(req, res) {
    await dbConnect();

    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const user = await User.findOne({ email: session.user.email }).select('referralCode totalDonations donorDetails');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If the user does not have a referral code, generate one
        if (!user.referralCode) {
            const newReferralCode = generateReferralCode(session.user.name);
            user.referralCode = newReferralCode;
            await user.save(); // Save the user with the new referral code
        }

        res.status(200).json({
            referralCode: user.referralCode,
            totalDonations: user.totalDonations || 0,
            donorDetails: user.donorDetails || [] // Return donor details
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
}
