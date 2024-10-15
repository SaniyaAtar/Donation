import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Profile() {
  const { data: session } = useSession();
  const [username, setUsername] = useState(session?.user?.name || '');
  const [profileImage, setProfileImage] = useState(null);
  const router = useRouter();

  const handleImageChange = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the updated data to your backend
    // For now, let's just redirect to the home page
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mt-10">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="border rounded-md w-full p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="profileImage">Profile Photo:</label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              className="border rounded-md w-full p-2"
            />
            {profileImage && (
              <img src={profileImage} alt="Profile Preview" className="mt-2 w-24 h-24 rounded-full" />
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 w-full"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
