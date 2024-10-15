// pages/logout.js
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Logout = () => {
    const router = useRouter();

    useEffect(() => {
        // Sign out the user
        const handleLogout = async () => {
            await signOut({ redirect: false }); // prevent redirect immediately
            router.push('/login'); // Redirect to login page after logout
        };

        handleLogout();
    }, [router]);

    return (
        <div className="flex items-center justify-center h-screen">
            <h2 className="text-2xl">Logging out...</h2>
        </div>
    );
};

export default Logout;
