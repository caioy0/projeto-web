// @/components/Confirm/ResetPasswordForm.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header'; // Opcional, dependendo se você quer header nessa página
import PasswordStrength from '@/components/Auth/PasswordStrength';
import { Lock, Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

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

        if (!formData.newPassword) newErrors.newPassword = 'A senha é obrigatória.';
        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem.';
        }
        if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'A senha deve ter no mínimo 8 caracteres.';
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
                setSuccessMessage('Senha alterada com sucesso! Redirecionando...');
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setErrors({ submit: data.message || 'Falha ao alterar a senha.' });
            }
        } catch {
            setErrors({ submit: 'Ocorreu um erro inesperado. Tente novamente.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (tokenValid === null) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-gray-300">
                <Loader2 className="animate-spin mb-4 text-purple-500" size={40} />
                <p>Verificando link de segurança...</p>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="text-red-500" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Link Inválido ou Expirado</h2>
                    <p className="text-gray-400 mb-6">
                        Este link de recuperação de senha não é mais válido. Por favor, solicite um novo.
                    </p>
                    <Link 
                        href="/login" 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                    >
                        <ArrowLeft size={18} /> Voltar para Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] relative flex flex-col items-center pt-20 px-4 selection:bg-purple-500/30">
            
            <div className="absolute top-0 w-full">
               <Header />
            </div>

            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <main className="w-full max-w-md mt-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                
                <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
                    
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-white mb-2">
                            Redefinir Senha
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Crie uma nova senha forte para sua conta.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {errors.submit && (
                            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl text-sm">
                                <AlertCircle size={18} />
                                <span>{errors.submit}</span>
                            </div>
                        )}
                        {successMessage && (
                            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-200 px-4 py-3 rounded-xl text-sm">
                                <CheckCircle size={18} />
                                <span>{successMessage}</span>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-300 ml-1 uppercase tracking-wider">Nova Senha</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    name="newPassword"
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className={`w-full pl-10 pr-4 py-3 bg-black/40 border rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all ${errors.newPassword ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-transparent'}`}
                                />
                            </div>
                            {errors.newPassword && <p className="text-red-400 text-xs ml-1 mt-1">{errors.newPassword}</p>}
                        </div>

                        <div className="px-1">
                             <PasswordStrength password={formData.newPassword} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-300 ml-1 uppercase tracking-wider">Confirmar Senha</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className={`w-full pl-10 pr-4 py-3 bg-black/40 border rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all ${errors.confirmPassword ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-transparent'}`}
                                />
                            </div>
                            {errors.confirmPassword && <p className="text-red-400 text-xs ml-1 mt-1">{errors.confirmPassword}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    <span>Atualizando...</span>
                                </>
                            ) : (
                                'Alterar Senha'
                            )}
                        </button>

                        <div className="text-center pt-4 border-t border-white/10">
                            <p className="text-gray-400 text-sm">
                                Lembrou sua senha?{' '}
                                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors hover:underline">
                                    Fazer Login
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}