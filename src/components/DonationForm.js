// components/DonationForm.js
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';

const DonationForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
  
    if (!stripe || !elements) {
      setLoading(false);
      return;
    }
  
    const cardElement = elements.getElement(CardElement);
    const referralCode = router.query.referral || ''; // Use referral from URL
  
    try {
      // Request the server to create a payment intent
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donorName, amount: parseInt(amount), referralCode }), // Ensure 'amount' is a number
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Server error during payment intent creation');
      }
  
      // ... (the rest of your code)
    } catch (error) {
      console.error("Error during submission:", error);
      setError(error.message); // Set a user-friendly error message
      setLoading(false);
    }
  };
  
  
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-8 bg-white shadow-lg rounded-lg"
    >
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Donate and Make a Difference
      </h2>

      {/* Donor Name */}
      <label className="block text-lg font-semibold text-gray-700 mb-2">
        Your Name
      </label>
      <input
        type="text"
        value={donorName}
        onChange={(e) => setDonorName(e.target.value)}
        required
        className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="Enter your name"
      />

      {/* Donation Amount */}
      <label className="block text-lg font-semibold text-gray-700 mb-2">
        Donation Amount (USD)
      </label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        min="1"
        className="w-full p-3 border border-gray-300 rounded-md mb-6 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="Enter amount (e.g., 50)"
      />

      {/* Card Element */}
      <label className="block text-lg font-semibold text-gray-700 mb-2">
        Card Details
      </label>
      <div className="p-4 border border-gray-300 rounded-md mb-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-md transition-all ${
          !stripe || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
        }`}
        disabled={!stripe || loading}
      >
        {loading ? 'Processing...' : 'Donate Now'}
      </button>

      {/* Error and Success Messages */}
      {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
      {success && (
        <div className="text-green-500 mt-4 text-center font-semibold">
          {success}
        </div>
      )}
    </form>
  );
};

export default DonationForm;
