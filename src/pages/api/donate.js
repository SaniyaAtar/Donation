import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useRouter } from 'next/router'; // To get referral code from query params

const DonationForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

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
    console.log({ donorName, amount: Number(amount), referralCode }); // Debugging log
  
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
//     } catch (error) {
//       console.error("Payment confirmation error:", error.message);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
  

      if (result.error) {
        setErrorMessage(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setShowThankYou(true);
        setTimeout(() => router.push('/thank-you'), 3000); // Redirect after success
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={loading || !stripe}>
        {loading ? 'Processing...' : 'Donate'}
      </button>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {showThankYou && <div style={{ color: 'green' }}>Thank you for your donation!</div>}
    </form>
  );
};

export default DonationForm;
