// @/components/Forms/RegisterForm.tsx
"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useRef, MouseEvent } from 'react';
import { UserValidator } from '@/lib/validations/users';
import PasswordStrength from '@/components/Auth/PasswordStrength';
import SplitText from '@/components/SplitText';
import { Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';

const SpotlightButton = ({ children, isLoading, onClick }: { children: React.ReactNode, isLoading: boolean, onClick?: (e: React.FormEvent) => void }) => {
  const divRef = useRef<HTMLButtonElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <button
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      onClick={onClick}
      disabled={isLoading}
      type="submit"
      className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3.5 px-4 font-bold text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed group border border-white/10"
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0 mix-blend-overlay"
        style={{
          opacity: isFocused ? 1 : 0,
          background: `radial-gradient(150px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.8), transparent 40%)`,
        }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading && <Loader2 className="animate-spin" size={20} />}
        {children}
      </span>
    </button>
  );
};

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
      newErrors.confirmPassword = 'As senhas não coincidem.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/register', {
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
      setErrors({ submit: `Ocorreu um erro: ${error}. Tente novamente.` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] relative flex items-center justify-center overflow-hidden px-4 selection:bg-purple-500/30">
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      <main className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 shadow-2xl">
          
          <div className="mb-8 text-center">
            <SplitText
              text="Criar Conta"
              className="text-3xl font-bold text-white mb-2 block"
              delay={50}
              duration={0.5}
              ease="power2.out"
              splitType="chars"
              from={{ opacity: 0, y: 20 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
            <p className="text-gray-400 text-sm">Junte-se à nossa comunidade gamer</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.submit && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} />
                <span>{errors.submit}</span>
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300 ml-1 uppercase tracking-wider">Nome Completo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                  <User size={18} />
                </div>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  required
                  className={`w-full pl-10 pr-4 py-3 bg-black/40 border rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all ${errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-transparent'}`}
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs ml-1">{errors.name}</p>}
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300 ml-1 uppercase tracking-wider">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  required
                  className={`w-full pl-10 pr-4 py-3 bg-black/40 border rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-transparent'}`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs ml-1">{errors.email}</p>}
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300 ml-1 uppercase tracking-wider">Senha</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className={`w-full pl-10 pr-4 py-3 bg-black/40 border rounded-xl text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all ${errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-transparent'}`}
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs ml-1">{errors.password}</p>}
            </div>
            
            <div className="px-1">
               <PasswordStrength password={formData.password} />
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
              {errors.confirmPassword && <p className="text-red-400 text-xs ml-1">{errors.confirmPassword}</p>}
            </div>
            
            <div className="pt-4">
              <SpotlightButton isLoading={isLoading}>
                {isLoading ? 'Criando conta...' : 'Criar Conta'}
              </SpotlightButton>
            </div>
            
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-gray-400 text-sm">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors hover:underline">
                  Entrar agora
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}