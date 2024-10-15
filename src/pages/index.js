import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image1 from '../images/images4.jpeg';
import Image2 from '../images/images5.jpeg';
import Image3 from '../images/images3.jpeg';
import { useRouter } from 'next/router'; // Import useRouter

export default function Home() {
  const { data: session, status } = useSession(); // Get the session data and status
  const router = useRouter();

  const userName = session?.user?.name || ''; // Default to 'Guest' if no user
  const userInitial = userName.charAt(0).toUpperCase(); // Get the first letter of the username
  const [currentImage, setCurrentImage] = useState(Image1); // Default image

  // Redirect to dashboard if user is logged in
  // useEffect(() => {
  //   if (status === 'authenticated') {
  //     router.push('/dashboard');
  //   }
  // }, [status, router]);

  // Array of images
  const images = [Image1, Image2, Image3];

  // Function to change the image
  const changeImage = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    setCurrentImage(images[randomIndex]);
  };

  // Change image every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(changeImage, 5000);
    return () => clearInterval(intervalId); // Clean up on component unmount
  }, []);

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen"><h2>Loading...</h2></div>; // Loading state
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Navigation Bar */}
      <div className="flex justify-between items-center bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold">Nayanpankh</h1>
        <div className="flex items-center space-x-4">
          {/* Display initial letter of user */}
          <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
            {userInitial}
          </div>
          {session ? (
            <Link href="/logout">
              <button className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition duration-200">Logout</button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition duration-200">Login</button>
              </Link>
              <Link href="/register">
                <button className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition duration-200">Register</button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/5 bg-gray-800 text-white p-4">
          <nav className="mt-4">
            <ul>
              <li className="mb-2">
                <Link href="/Dashboard">
                  <span className="hover:text-gray-300">Dashboard</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/Transactions">
                  <span className="hover:text-gray-300">Transactions</span>
                </Link>
              </li>
              {/* Add other navigation links */}
            </ul>
          </nav>
        </div>

        {/* Main Content Area with Image */}
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 relative">
          <img src={currentImage.src} alt="Main Image" className="w-full h-auto object-cover" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black bg-opacity-50">
            <h2 className="text-3xl font-bold mb-2">Welcome, {userName}</h2>
            <p className="mb-4">
              Initial push is the toughest! Go through the learning modules, or reach out to your fundraising manager to level up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
