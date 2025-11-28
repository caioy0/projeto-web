// @/components/UserSettings/UserConfig.tsx
"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, AlertCircle } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  active: boolean;
};

export default function UserConfig() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [active, setActive] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Carregar dados do usuário
useEffect(() => {
  startTransition(async () => {
    try {
      // 1. Verifica se está autenticado
      const authRes = await fetch("/api/auth/status", { cache: "no-store" });
      const authData = await authRes.json();

      if (!authData.isAuthenticated) {
        router.push("/login");
        return;
      }

      // 2. Busca o userId
      const meRes = await fetch("/api/auth/me", { cache: "no-store" });
      const meData = await meRes.json();
      if (!meData.userId) throw new Error("Não foi possível obter o usuário.");
      const userId = meData.userId;

      // 3. Busca dados do usuário
      const res = await fetch(`/api/client/${userId}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Não foi possível buscar o usuário.");
      const data: User = await res.json();

      setUser(data);
      setFormData({ name: data.name, email: data.email });
      setActive(data.active);
    } catch (error) {
      setErrors(error instanceof Error ? error.message : "Erro ao carregar usuário.");
      router.push("/");
    }
  });
}, [router]);



  if (!user) return <div>Carregando...</div>;

  // Atualizar perfil
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await fetch(`/api/client/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: formData.name, email: formData.email }),
        });
        if (!res.ok) throw new Error("Erro ao atualizar dados.");
        const updated = await res.json();
        setUser(updated);
        setFormData({ name: updated.name, email: updated.email });
        setSuccessMsg("Dados atualizados com sucesso!");
        setErrors(null);
      } catch (error) {
        setErrors(error instanceof Error ? error.message : "Erro ao atualizar dados.");
      }
    });
  };

  // Atualizar senha (usa PUT também, enviando password)
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setErrors("As senhas não coincidem.");
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch(`/api/client/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: passwordData.newPassword }),
        });
        if (!res.ok) throw new Error("Erro ao atualizar senha.");
        await res.json();
        setSuccessMsg("Senha atualizada com sucesso!");
        setErrors(null);
        setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      } catch (error) {
        setErrors(error instanceof Error ? error.message : "Erro ao atualizar senha.");
      }
    });
  };

  // Ativar/Desativar conta
  const handleToggleActive = async () => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/client/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active: !active }),
        });
        if (!res.ok) throw new Error("Erro ao atualizar status da conta.");
        const updated = await res.json();
        setActive(updated.active);
        setSuccessMsg(`Conta ${updated.active ? "ativada" : "desativada"} com sucesso!`);
        setErrors(null);
      } catch (error) {
        setErrors(error instanceof Error ? error.message : "Erro ao atualizar status da conta.");
      }
    });
  };

    return (
    <div className="min-h-screen bg-[#050505] relative flex items-center justify-center overflow-hidden px-4 selection:bg-purple-500/30">
      
      {/* Glow background */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      <main className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-2xl">
          
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Configurações do Usuário</h1>
            <p className="text-gray-400 text-sm">Gerencie seu perfil e segurança</p>
          </div>

          {/* Mensagens */}
          {errors && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-2 mb-4">
              <AlertCircle size={18} />
              <span>{errors}</span>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-200 px-4 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-2 mb-4">
              <span>{successMsg}</span>
            </div>
          )}

          {/* Perfil */}
          <form onSubmit={handleUpdateUser} className="space-y-5">
            <h2 className="text-lg font-semibold text-white">Perfil</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300 ml-1 uppercase tracking-wider">Nome</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome"
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all border-white/10 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300 ml-1 uppercase tracking-wider">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all border-white/10 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors disabled:opacity-50"
            >
              Salvar Perfil
            </button>
          </form>

          {/* Senha */}
          <form onSubmit={handleUpdatePassword} className="space-y-5 mt-8">
            <h2 className="text-lg font-semibold text-white">Alterar Senha</h2>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300 ml-1 uppercase tracking-wider">Senha Atual</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all border-white/10 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300 ml-1 uppercase tracking-wider">Nova Senha</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all border-white/10 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300 ml-1 uppercase tracking-wider">Confirmar Senha</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all border-white/10 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-colors disabled:opacity-50"
            >
              Atualizar Senha
            </button>
          </form>

          {/* Status da Conta */}
          <div className="space-y-3 mt-8">
            <h2 className="text-lg font-semibold text-white">Status da Conta</h2>
            <p className="text-gray-300 text-sm">Status: {active ? "Ativa" : "Inativa"}</p>
            <button
              onClick={handleToggleActive}
              disabled={isPending}
              className={`w-full py-3 rounded-xl font-medium text-white transition-colors ${
                active ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 hover:bg-gray-700"
              } disabled:opacity-50`}
            >
              {active ? "Desativar Conta" : "Ativar Conta"}
            </button>
          </div>
        </div>
    </main>
  </div>
  );
}
