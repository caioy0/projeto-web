"use client";

import { useState } from "react";

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
      setError("Insira um email válido.");
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
        setSuccess("Link de redefinição de senha enviado com sucesso!");
        setEmail("");
      } else {
        setError(data.error || "Erro ao enviar link de redefinição.");
      }
    } catch (err) {
      setError(`Error: ${err}. Tente novamente.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4">Redefinir Senha</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-sm space-y-4"
      >
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
            {success}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={handleChange}
            required
            placeholder="seuemail@exemplo.com"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={!isEmailValid || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200 disabled:opacity-50"
        >
          {isLoading ? "Enviando..." : "Enviar link"}
        </button>
      </form>

      <p className="mt-4 text-gray-600 dark:text-gray-300">
        Lembrou sua senha? <a href="/login" className="text-blue-600 hover:underline">Faça login</a>.
      </p>
    </div>
  );
}