// src/components/Header.tsx
'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Checa status de autenticação ao montar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status', { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(data.isAuthenticated);
      }
    } catch (error) {
      console.error('Erro ao checar status de login:', error);
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
        window.location.href = '/'; // redireciona para home
      }
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  };

  if (isLoading) {
    return (
      <header className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-5 md:space-y-0 py-4 px-6 bg-background text-foreground">
        <div>
          <Image 
            src="/wave.png" 
            alt="Logo" 
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
    <header className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-5 md:space-y-0 py-4 px-6 bg-background text-foreground">
      <div>
        <Link href="/">
          <Image 
            src="/wave.png" 
            alt="Logo" 
            width={100} 
            height={25} 
            priority 
            className="hover:opacity-80 transition-opacity"
          />
        </Link>
      </div>

      <nav className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <Link
          href="/"
          className="text-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition px-4 py-2 rounded-md"
        >
          Menu
        </Link>
        <Link
          href="/about"
          className="text-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition px-4 py-2 rounded-md"
        >
          About us
        </Link>
        <Link
          href="/product"
          className="text-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition px-4 py-2 rounded-md"
        >
          Product Page
        </Link>
        <Link
          href="/orders"
          className="text-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition px-4 py-2 rounded-md"
        >
          Orders
        </Link>
        <Link
          href="/cart"
          className="text-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition px-4 py-2 rounded-md"
        >
          Cart
        </Link>

        {isLoggedIn ? (
          <>
            <Link
              href="/settings"
              className="text-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition px-4 py-2 rounded-md"
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="text-lg font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-900 transition px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition px-4 py-2 rounded-md"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition px-4 py-2 rounded-md"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
