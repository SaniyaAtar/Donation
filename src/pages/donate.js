// pages/donate.js
import { useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import { useRouter } from 'next/router';

// Load your publishable key from the .env file
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const DonationForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!stripe || !elements) {
      return; // Stripe.js has not yet loaded.
    }

    const cardElement = elements.getElement(CardElement);
    const referralCode = router.query.referral || ''; // Use referral from URL

    setLoading(true);
    try {
      // Request the server to create a payment intent
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donorName, amount: Number(amount), referralCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Server error during payment intent creation');
      }

      const { clientSecret } = data; // Get the client secret from the server response

      // Confirm the payment using Stripe.js
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: donorName,
          },
        },
      });

      if (result.error) {
        // Show error to the customer (e.g., insufficient funds)
        setError(result.error.message);
        console.error(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setSuccess('Thank you for your donation!');
        setTimeout(() => router.push('/'), 3000); // Redirect after 3 seconds
      }
    } catch (error) {
      console.error("Payment confirmation error:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div>
        <label className="block text-gray-700" htmlFor="donorName">
          Your Name
        </label>
        <input
          type="text"
          id="donorName"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700" htmlFor="amount">
          Donation Amount (in USD)
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div role="group" aria-labelledby="card-details">
        <label id="card-details" htmlFor="card-element" className="block text-gray-700">
          Card Details
        </label>
        <CardElement className="p-2 border rounded" />
      </div>
      <button 
        type="submit" 
        disabled={!stripe || loading} 
        className={`px-4 py-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'}`}
      >
        {loading ? 'Processing...' : 'Donate'}
      </button>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
    </form>
  );
};

const DonatePage = () => {
  return (
    <Elements stripe={stripePromise}>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Make a Donation</h1>
        <DonationForm />
      </div>
    </Elements>
  );
};

export default DonatePage;
