// @/component/Active.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ActivePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        const activateAccount = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));

            try {
                if (!token) {
                    throw new Error('Token de ativação não encontrado.');
                }

                const response = await fetch('/api/active', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Erro ao ativar conta.');
                }

                // Redireciona para login após ativação bem sucedida
                setTimeout(() => {
                    router.push('/login');
                }, 3000);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado.');
            } finally {
                setIsLoading(false);
            }
        };

        activateAccount();
    }, [token, router]);

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center px-4 bg-[#050505] text-gray-100 selection:bg-purple-500/30">
            
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <main className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
                
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl text-center min-h-[300px] flex flex-col items-center justify-center">
                    
                    {isLoading && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="relative">
                                <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
                                <Loader2 size={48} className="text-purple-400 animate-spin relative z-10 mx-auto" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Verificando sua conta...</h2>
                            <p className="text-gray-400 text-sm">
                                Estamos validando suas informações de segurança.
                            </p>
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="space-y-6 animate-in zoom-in-95 duration-300">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-red-500/20">
                                <XCircle size={32} className="text-red-500" />
                            </div>
                            
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2">Falha na Ativação</h2>
                                <p className="text-red-200 bg-red-500/10 border border-red-500/20 py-2 px-4 rounded-lg text-sm inline-block">
                                    {error}
                                </p>
                            </div>

                            <p className="text-gray-400 text-sm">
                                O link pode ter expirado ou já ter sido utilizado.
                            </p>

                            <Link 
                                href="/login" 
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all w-full justify-center group"
                            >
                                Voltar para Login <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    )}

                    {!isLoading && !error && (
                        <div className="space-y-6 animate-in zoom-in-95 duration-300">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20 relative">
                                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
                                <CheckCircle2 size={40} className="text-green-400 relative z-10" />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-white mb-2">
                                    Conta Ativada!
                                </h2>
                                <p className="text-gray-400">
                                    Seu cadastro foi confirmado com sucesso.
                                </p>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-sm text-purple-400 bg-purple-500/5 py-2 px-4 rounded-full border border-purple-500/10">
                                <Loader2 size={14} className="animate-spin" />
                                Redirecionando para o login...
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}