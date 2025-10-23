'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ActiveAccount() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        const activateAccount = async () => {
            try {
                if (!token) {
                    setError('Token de ativação não encontrado');
                    return;
                }

                const response = await fetch('/active/api', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Erro ao ativar conta');
                }

                // Redireciona para login após ativação bem sucedida
                setTimeout(() => {
                    router.push('/login');
                }, 3000);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao ativar conta');
            } finally {
                setIsLoading(false);
            }
        };

        activateAccount();
    }, [token, router]);

    return (
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
            {isLoading ? (
                <p className="text-center">Ativando sua conta...</p>
            ) : error ? (
                <div className="text-red-600 text-center">{error}</div>
            ) : (
                <div className="text-green-600 text-center">
                    <p>Conta ativada com sucesso!</p>
                    <p className="text-sm mt-2">Redirecionando para o login...</p>
                </div>
            )}
        </div>
    );
}
