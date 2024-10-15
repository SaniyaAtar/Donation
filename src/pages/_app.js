// src/pages/_app.js
import '../style/globals.css'; // Ensure this path is correct
import { SessionProvider } from 'next-auth/react'; // Import SessionProvider from NextAuth

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
