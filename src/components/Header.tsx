// src/components/Header.tsx
'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status');
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(data.isAuthenticated);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        setIsLoggedIn(false);
        window.location.href = '/'; // Redirect to home page
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Show loading state briefly
  if (isLoading) {
    return (
      <header className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-5 md:space-y-0 mt-0 py-4 px-6 bg-background text-foreground">
        <div>
          <Image 
            src="/wave.svg" 
            alt="Next.js logo" 
            width={100} 
            height={25} 
            priority 
            className="dark:invert"
          />
        </div>
        <nav className="flex space-x-4">
          <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        </nav>
      </header>
    );
  }

  return (
    <header className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-5 md:space-y-0 mt-0 py-4 px-6 bg-background text-foreground">
      <div>
        <Link href="/">
          <Image 
            src="/wave.png" 
            alt="Next.js logo" 
            width={100} 
            height={25} 
            priority 
            className=" hover:opacity-80 transition-opacity"
          />
        </Link>
      </div>

      <nav className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <Link
          href="/"
          className="text-lg font-medium text-foreground hover:bg-gray-200 dark:hover:bg-gray-800 transition duration-300 ease-in-out hover:shadow-md px-4 py-2 rounded-md"
        >
          Menu
        </Link>
        
        <Link
          href="/about/"
          className="text-lg font-medium text-foreground hover:bg-gray-200 dark:hover:bg-gray-800 transition duration-300 ease-in-out hover:shadow-md px-4 py-2 rounded-md"
        >
          About us
        </Link>

        <Link
          href="/register-product/"
          className="text-lg font-medium text-foreground hover:bg-gray-200 dark:hover:bg-gray-800 transition duration-300 ease-in-out hover:shadow-md px-4 py-2 rounded-md"
        >
          Register product
        </Link>
        <Link
          href="/create-category/"
          className="text-lg font-medium text-foreground hover:bg-gray-200 dark:hover:bg-gray-800 transition duration-300 ease-in-out hover:shadow-md px-4 py-2 rounded-md"
        >
          Create category
        </Link>

        {isLoggedIn ? (
          // Show these when user is logged in
          <>
            <Link
              href="/settings"
              className="text-lg font-medium text-foreground hover:bg-gray-200 dark:hover:bg-gray-800 transition duration-300 ease-in-out hover:shadow-md px-4 py-2 rounded-md"
            >
              Settings
            </Link>
            
            <button
              onClick={handleLogout}
              className="text-lg font-medium text-foreground hover:bg-red-100 dark:hover:bg-red-900 transition duration-300 ease-in-out hover:shadow-md px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </>
        ) : (
          // Show these when user is logged out
          <>
            <Link
              href="/login"
              className="text-lg font-medium text-foreground hover:bg-gray-200 dark:hover:bg-gray-800 transition duration-300 ease-in-out hover:shadow-md px-4 py-2 rounded-md"
            >
              Login
            </Link>
            
            <Link
              href="/register"
              className="text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition duration-300 ease-in-out hover:shadow-md px-4 py-2 rounded-md"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}