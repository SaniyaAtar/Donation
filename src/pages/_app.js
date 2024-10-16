// // pages/_app.js
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
import '../style/globals.css';

// const stripePromise = loadStripe('your-public-key-here'); // Replace with your actual public key

// function MyApp({ Component, pageProps }) {
//   return (
//     <Elements stripe={stripePromise}>
//       <Component {...pageProps} />
//     </Elements>
//   );
// }

// export default MyApp;
// _app.js
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
