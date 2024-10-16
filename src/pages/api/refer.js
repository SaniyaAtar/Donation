// // pages/api/refer.js
// import dbConnect from '../../src/utils/dbConnect';
// import User from '../../src/models/User';

// export default async function handler(req, res) {
//     await dbConnect();

//     if (req.method === 'POST') {
//         const { referralCode } = req.body;

//         try {
//             const referrer = await User.findOne({ referralCode });
//             if (referrer) {
//                 // Logic for tracking the referral, e.g., reward the referrer
//                 res.status(200).json({ message: 'Referral code is valid.', referrer });
//             } else {
//                 res.status(404).json({ message: 'Referral code not found.' });
//             }
//         } catch (error) {
//             res.status(500).json({ error: 'Error verifying referral code' });
//         }
//     } else {
//         res.setHeader('Allow', ['POST']);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }
