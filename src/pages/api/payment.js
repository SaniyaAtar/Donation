// pages/api/payment.js
import dbConnect from '../../../src/utils/dbConnect';
import Donation from '../../../src/models/Donation';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { donorName, amount, referralCode } = req.body;

    // Validate the input
    if (!donorName || !amount || amount <= 0 || !referralCode) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    try {
      // Create a new donation entry in the database
      const donation = await Donation.create({ 
        name: donorName, 
        amount, 
        referralCode 
      });

      // Create a Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Amount in cents
        currency: 'usd',
        payment_method_types: ['card'],
      });

      // Send back the client secret for the payment intent
      res.status(201).json({
        clientSecret: paymentIntent.client_secret,
        donationId: donation._id,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
