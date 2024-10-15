// src/pages/donate.js
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const DonationForm = () => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false); // State for the thank you message
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return; // Stripe.js has not yet loaded.
        }

        const cardElement = elements.getElement(CardElement);
        
        // Get the referral code from the URL if it exists
        const referralCode = router.query.referral || 'defaultReferralCode'; // Replace with a real default or empty string if you want

        // Create a payment intent on your backend
        const response = await fetch('/api/payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, amount, referral: referralCode }), // Send the referral code
        });

        const { clientSecret } = await response.json();

        setLoading(true);

        try {
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name,
                    },
                },
            });

            if (result.error) {
                console.error(result.error.message);
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    console.log('Donation successful!');
                    setShowThankYou(true); // Show thank you message
                    setTimeout(() => {
                        router.push('/'); // Redirect to home page after 3 seconds
                    }, 3000);
                }
            }
        } catch (error) {
            console.error("Payment confirmation error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-4">Make a Donation</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-semibold mb-1">Name</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="amount" className="block text-gray-700 font-semibold mb-1">Amount</label>
                    <input
                        id="amount"
                        type="number"
                        placeholder="Amount in USD"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-1">Card Details</label>
                    <CardElement className="border border-gray-300 p-2 rounded" />
                </div>
                <button 
                    type="submit" 
                    disabled={!stripe || loading} 
                    className={`w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Processing...' : 'Donate'}
                </button>
            </form>

            {showThankYou && ( // Conditional rendering for thank you message
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h3 className="text-lg font-semibold mb-2">Thank You for Your Donation!</h3>
                        <p>Your contribution is greatly appreciated.</p>
                        <button 
                            onClick={() => setShowThankYou(false)} 
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const DonatePage = () => (
    <Elements stripe={stripePromise}>
        <DonationForm />
    </Elements>
);

export default DonatePage;
