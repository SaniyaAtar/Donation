// src/pages/dashboard.js

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function Dashboard() {
    const { data: session } = useSession();
    const [referralCode, setReferralCode] = useState(""); 
    const [totalDonations, setTotalDonations] = useState(0); 
    const [donorDetails, setDonorDetails] = useState([]); 

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch(`/api/dashboard`);
                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }
                const data = await response.json();
                setReferralCode(data.referralCode);
                setTotalDonations(data.totalDonations);
                setDonorDetails(data.donorDetails || []); 
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        if (session) {
            fetchDashboardData();
        }
    }, [session]);

    const copyToClipboard = () => {
        const donationLink = `${window.location.origin}/donate?referral=${referralCode}`;
        navigator.clipboard.writeText(donationLink)
            .then(() => {
                alert('Donation link copied to clipboard!');
            })
            .catch((err) => {
                console.error('Could not copy text: ', err);
            });
    };

    const shareOnWhatsApp = () => {
        const donationLink = `${window.location.origin}/donate?referral=${referralCode}`;
        const message = `Join me in supporting a great cause! Donate here: ${donationLink}`;
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6 mt-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Hello {session?.user?.name},</h1>
                <p className="text-gray-600 mb-6">
                    Initial push is the toughest! Go through the learning modules, or reach out to your fundraising manager to level up.
                </p>

                <div className="bg-gray-200 rounded-md p-4 mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">Goal Achieved</h2>
                    <p className="text-lg font-medium">{totalDonations} Donations made via your referral code!</p>
                </div>

                <div className="bg-gray-200 rounded-md p-4 mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">Donors Using Your Referral Code</h2>
                    <ul>
                        {Array.isArray(donorDetails) && donorDetails.length > 0 ? (
                            donorDetails.map((donor, index) => (
                                <li key={index} className="text-lg font-medium">
                                    {donor.name} donated ${donor.amount} on {new Date(donor.createdAt).toLocaleDateString()}
                                </li>
                            ))
                        ) : (
                            <li className="text-lg font-medium">No donors yet.</li>
                        )}
                    </ul>
                </div>

                <div className="flex space-x-4 mb-4">
                    <button
                        onClick={copyToClipboard}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Copy Donation Link
                    </button>
                    <button
                        onClick={shareOnWhatsApp}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
                    >
                        Share on WhatsApp
                    </button>
                </div>

                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-700">Your Referral Code:</h3>
                    <p className="text-2xl font-bold text-gray-800">{referralCode || 'No referral code available'}</p>
                </div>
            </div>
        </div>
    );
}
