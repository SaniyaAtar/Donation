// src/pages/transactions.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('/api/transactions'); // Adjust this endpoint as necessary
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold mb-4">Your Transactions</h1>
                <ul className="list-disc list-inside">
                    {transactions.length > 0 ? (
                        transactions.map((transaction) => (
                            <li key={transaction._id} className="mb-2">
                                {transaction.name} donated ${transaction.amount} using referral code {transaction.referral}
                            </li>
                        ))
                    ) : (
                        <li>No transactions found.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
