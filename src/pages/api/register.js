import dbConnect from '../../../src/utils/dbConnect'; // Adjust the path as needed
import User from '../../../src/models/User'; // Adjust the path as needed
import bcrypt from 'bcrypt';
import generateReferralCode from '../../../src/utils/generateReferralCode'; // Ensure the path is correct

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        const { name, email, password, phone } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a referral code
        const referralCode = generateReferralCode(name);

        // Create a new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            referralCode, // Save the generated referral code in the user document
        });

        try {
            // Save the new user to the database
            await user.save();
            return res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating user', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
