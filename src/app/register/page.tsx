<<<<<<< HEAD
"use client"

import React, { useState } from 'react';
import Header from '@/components/Header';
import AuthCard from '@/components/Auth/AuthCard';
import InputField from '@/components/Auth/InputField';
import PasswordStrength from '@/components/Auth/PasswordStrength';
import { UserValidator } from '@/lib/validations/users';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
      setErrors({ submit: `An error occurred: ${error}. Please try again.` });
    } finally {
      setIsLoading(false);
    }
  };
=======
// @/app/register/page.tsx
import Header from "@/components/Header";
import RegisterForm from "@/components/Forms/RegisterForm";
>>>>>>> prod

export default async function RegisterPage(){
  return (
    <main>
      <div>
        <Header/>
      </div>
      <div>
        <RegisterForm/>
      </div>
    </main>
  );
}