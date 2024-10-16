// src/pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs'; // If you're using bcrypt for password hashing
import User from '../../../models/User'; // Ensure you have your User model correctly imported

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "your-email@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Connect to the database and find the user
                const user = await User.findOne({ email: credentials.email });
                
                if (user && await compare(credentials.password, user.password)) {
                    // If you return the user object, it will be saved in the session
                    return { email: user.email, name: user.name }; // Add any other user properties you need
                }
                
                // Return null if user data could not be retrieved
                return null;
            }
        }),
    ],
    pages: {
        signIn: '/login', // Customize the sign-in page URL
    },
    session: {
        strategy: 'jwt', // Use JWT strategy for session management
    },
    secret: process.env.NEXTAUTH_SECRET, // Add a secret to sign the tokens
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email; // Pass user email to the token
                token.name = user.name; // Pass user name to the token
            }
            return token;
        },
        async session({ session, token }) {
            session.user.email = token.email; // Add email to the session
            session.user.name = token.name; // Add name to the session
            return session;
        },
    },
});
