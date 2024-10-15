// src/pages/api/payment.js
import { buffer } from 'micro';
import dbConnect from '../../../src/utils/dbConnect';
import Donation from '../../../src/models/Donation';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
    api: {
        bodyParser: false, // Disable body parsing for this API route
    },
};

const handler = async (req, res) => {
    await dbConnect();

    if (req.method === 'POST') {
        const buf = await buffer(req);
        const { name, amount, referral } = JSON.parse(buf.toString());

        try {
            // Create a new donation in the database
            const donation = await Donation.create({ name, amount, referral });

            // Create a payment intent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount * 100, // Amount in cents
                currency: 'usd',
                payment_method_types: ['card'],
            });

            res.status(200).json({
                clientSecret: paymentIntent.client_secret,
                donationId: donation._id,
            });
        } catch (error) {
            console.error('Error processing payment:', error);
            res.status(500).json({ message: 'Error processing payment', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default handler;
