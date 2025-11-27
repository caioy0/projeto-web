// src/components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn, Loader2, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onSuccessRedirect?: string;
}

export default function LoginForm({ onSuccessRedirect = '/dashboard' }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/login/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Falha no login. Verifique suas credenciais.');
        return;
      }

      router.push(onSuccessRedirect);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex justify-center items-center px-4 bg-[#050505] text-gray-100 selection:bg-purple-500/30">
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-white mb-2">
            Bem-vindo
          </h1>
          <p className="text-gray-400 text-sm">
            Insira suas credenciais para acessar sua conta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300 ml-1 uppercase tracking-wider">
              Email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-300 ml-1 uppercase tracking-wider">
              Senha
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full flex justify-center items-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Entrando...</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>Acessar Conta</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-white/10">
          <p className="text-sm text-gray-400">
            Ainda não tem uma conta?{' '}
            <Link 
              href="/register" 
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors hover:underline"
            >
              Registre-se aqui
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}