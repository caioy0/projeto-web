// src/app/register/page.tsx
import React, { useState } from 'react';
import Header from '@/components/Header';
import AuthCard from '@/components/Auth/AuthCard';
import InputField from '@/components/Auth/InputField';
import PasswordStrength from '@/components/Auth/PasswordStrength';
import { UserValidator } from '@/lib/validations/users';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const validation = UserValidator.validateCreateInput({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });
    
    const newErrors: Record<string, string> = {};
    validation.errors.forEach(error => {
      if (error.includes('Name')) newErrors.name = error;
      if (error.includes('Email')) newErrors.email = error;
      if (error.includes('Password')) newErrors.password = error;
    });
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Register confirmation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('register/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      if (response.ok) {
        router.push('/login?message=registration_success');
      } else {
        setErrors({ submit: data.message });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <AuthCard title="Create your account">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {errors.submit}
              </div>
            )}
            
            <InputField
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              error={errors.name}
              onChange={handleChange}
              required
            />
            
            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              error={errors.email}
              onChange={handleChange}
              required
            />
            
            <InputField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              error={errors.password}
              onChange={handleChange}
              required
            />
            
            <PasswordStrength password={formData.password} />
            
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              error={errors.confirmPassword}
              onChange={handleChange}
              required
            />
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
            
            <p className="text-center text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </AuthCard>
      </main>
    </div>
  );
}