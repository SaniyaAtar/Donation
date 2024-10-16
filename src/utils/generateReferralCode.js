// src/utils/generateReferralCode.js

export default function generateReferralCode(name) {
    // Generate a referral code based on the user's name and a unique identifier (e.g., current timestamp)
    const timestamp = Date.now().toString(36); // Convert timestamp to base-36 string
    const namePart = name.split(' ').join('').slice(0, 3).toUpperCase(); // Take first 3 letters of the name
    return `${namePart}-${timestamp}`; // Combine for uniqueness
}
