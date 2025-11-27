// src/components/Header.tsx
'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, LogOut, Settings } from 'lucide-react';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Sobre nós', href: '/about/' },
    { label: 'Produtos', href: '/product/' },
    { label: 'Pedidos', href: '/orders/' }
  ];

  // --- Efeitos ---
  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        window.location.href = '/'; 
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (isLoading) {
    return (
      <header className="fixed top-0 w-full py-5 px-6 flex justify-between items-center z-50 bg-black/20 backdrop-blur-sm">
        <div className="h-8 w-64 bg-white/10 rounded-full animate-pulse hidden md:block"></div>
        <div className="h-8 w-20 bg-white/10 rounded animate-pulse"></div>
      </header>
    );
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b ${
        isScrolled
          ? 'bg-black/60 backdrop-blur-xl border-white/5 py-3 shadow-lg'
          : 'bg-transparent border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/5 backdrop-blur-md">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative px-4 py-2 text-sm font-medium text-gray-300 transition-colors duration-200 rounded-full hover:text-white hover:bg-white/10 focus:outline-none"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4 z-50">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
               <Link 
                  href="/settings"
                  className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all"
                  title="Configurações"
               >
                 <Settings size={20} />
               </Link>
               <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-red-400 transition-colors px-4 py-2 rounded-md hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
                >
                  <LogOut size={18} />
                  <span>Sair</span>
                </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
               <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                 Login
               </Link>
               <Link 
                 href="/register" 
                 className="px-5 py-2 text-sm font-bold text-black bg-white rounded-full hover:bg-gray-200 transition-transform hover:scale-105 active:scale-95"
               >
                 Registrar
               </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden text-gray-300 hover:text-white p-2 z-50 ml-auto"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-0 left-0 w-full h-screen bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center z-40 animate-in fade-in duration-200">
          <nav className="flex flex-col items-center space-y-6 text-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-2xl font-medium text-gray-300 hover:text-purple-400 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="w-16 h-px bg-white/10 my-4" />

            {isLoggedIn ? (
              <>
                <Link 
                  href="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-xl text-gray-300 hover:text-white"
                >
                  <Settings size={24} /> Configurações
                </Link>
                <button 
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-2 text-xl text-red-400 font-medium hover:text-red-300"
                >
                  <LogOut size={24} /> Sair
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-4 w-full px-8">
                <Link 
                  href="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl text-gray-300 hover:text-white"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-8 py-3 text-lg font-bold bg-white text-black rounded-full"
                >
                  Registrar
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}