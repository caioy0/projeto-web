// @/components/Auth/RegisterForm.tsx
"use client";

import React, { useState, useTransition } from "react";
import Header from "@/components/Header";
import AuthCard from "@/components/Auth/AuthCard";
import InputField from "@/components/Auth/InputField";
import PasswordStrength from "@/components/Auth/PasswordStrength";
import { UserValidator } from "@/lib/validations/users";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUserAction } from "@/actions/auth";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const validation = UserValidator.validateCreateInput({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    const newErrors: Record<string, string> = {};
    validation.errors.forEach((error) => {
      if (error.includes("Name")) newErrors.name = error;
      if (error.includes("Email")) newErrors.email = error;
      if (error.includes("Password")) newErrors.password = error;
    });

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    startTransition(async () => {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("password", formData.password);

      try {
        const result = await registerUserAction(form);

        if (result?.error) {
          setErrors({ submit: result.error });
        } else {
          router.push("/login?message=registration_success");
        }
      } catch (err) {
        console.error(err);
        setErrors({ submit: "An error occurred. Please try again." });
      }
    });
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
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 disabled:opacity-50"
            >
              {isPending ? "Creating account..." : "Create account"}
            </button>

            <p className="text-center text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </form>
        </AuthCard>
      </main>
    </div>
  );
}
