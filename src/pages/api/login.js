import dbConnect from '../../../src/utils/dbConnect';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../../src/models/User';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isMatch = await compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Sign the JWT token using the secret
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ token });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
