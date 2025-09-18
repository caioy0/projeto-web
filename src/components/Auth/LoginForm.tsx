"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginUserAction } from "@/actions/auth";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const form = new FormData();
      form.append("email", formData.email);
      form.append("password", formData.password);

      try {
        const result = await loginUserAction(form);
        if (result?.error) {
          setError(result.error);
        } else {
          router.push("/dashboard"); // redireciona após login
        }
      } catch (err) {
        console.error("Login error:", err);
        setError("Erro de conexão. Tente novamente.");
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-sm space-y-4"
      >
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {error}
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
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200 disabled:opacity-50"
        >
          {isPending ? "Entrando..." : "Log in"}
        </button>
      </form>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        Não tem uma conta?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Registre-se aqui
        </a>
        .
      </p>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        <a href="/reset-sender" className="text-blue-600 hover:underline">
          Esqueceu sua senha?
        </a>
      </p>
    </div>
  );
}
