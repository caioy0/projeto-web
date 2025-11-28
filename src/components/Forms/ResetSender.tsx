// src/components/ResetSender.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function ResetSender() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validação simples de email
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid) {
      setError("Por favor, insira um email válido.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/reset-sender/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess("Link enviado! Verifique sua caixa de entrada.");
        setEmail("");
      } else {
        setError(data.error || "Não foi possível enviar o link. Tente novamente.");
      }
    } catch (err) {
      setError(`Ocorreu um erro de conexão, erro:${err}. Tente mais tarde.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-4 bg-[#050505] text-gray-100 selection:bg-purple-500/30">
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <main className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-white mb-2">
              Recuperar Senha
            </h1>
            <p className="text-gray-400 text-sm">
              Informe seu email para receber o link de redefinição.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-200 px-4 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
                <CheckCircle size={18} className="flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-medium text-gray-300 ml-1 uppercase tracking-wider">
                Email Cadastrado
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  required
                  placeholder="exemplo@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!isEmailValid || isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                'Enviar Link de Recuperação'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Voltar para o Login
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}