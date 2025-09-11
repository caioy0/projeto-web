// src/app/register/page.tsx
import React from 'react';
import Header from '@/components/Header';
import RegisterForm from '@/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <RegisterForm />
      </main>
    </div>
  );
}