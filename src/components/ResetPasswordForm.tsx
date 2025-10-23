'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import AuthCard from '@/components/Auth/AuthCard';
import InputField from '@/components/Auth/InputField';
import PasswordStrength from '@/components/Auth/PasswordStrength';
import Link from 'next/link';

export default function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [tokenValid, setTokenValid] = useState<boolean | null>(null);

    // Verifica o token quando a página carrega
    useEffect(() => {
        if (!token) {
            setTokenValid(false);
            return;
        }

        fetch(`/reset-password/api?token=${token}`)
            .then(res => res.json())
            .then(data => setTokenValid(data.valid))
            .catch(() => setTokenValid(false));
    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.newPassword) newErrors.newPassword = 'Senha é necessária';
        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Senhas não batem';
        }
        if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Senha deve ter no mínimo 8 dígitos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (!token) return;

        setIsLoading(true);
        setSuccessMessage('');
        try {
            const response = await fetch('/reset-password/api', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, token }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage('Senha alterada com sucesso! Redirecionando para o login...');
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setErrors({ submit: data.message || 'Falha na alteração de senha' });
            }
        } catch {
            setErrors({ submit: 'Um erro ocorreu. Tente novamente' });
        } finally {
            setIsLoading(false);
        }
    };

    // validação token
    if (tokenValid === null)
        return <div className="p-8 text-center">Validando Token...</div>;
    if (!tokenValid)
        return <div className="p-8 text-center text-red-600">Token inválido ou expirado</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <AuthCard title="Reset Your Password">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors.submit && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {errors.submit}
                            </div>
                        )}
                        {successMessage && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                {successMessage}
                            </div>
                        )}

                        <InputField
                            label="Nova senha"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            error={errors.newPassword}
                            onChange={handleChange}
                            required
                        />
                        <PasswordStrength password={formData.newPassword} />

                        <InputField
                            label="Confirme a senha"
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
                            {isLoading ? 'Resetting password...' : 'Reset Password'}
                        </button>

                        <p className="text-center text-gray-600 dark:text-gray-400">
                            Lembrou sua senha?{' '}
                            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                Login
                            </Link>
                        </p>
                    </form>
                </AuthCard>
            </main>
        </div>
    );
}
