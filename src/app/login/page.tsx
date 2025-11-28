<<<<<<< HEAD
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/login/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/");
      } else {
        setError(data.error || "Erro ao fazer login.");
      }
    } catch (err) {
      setError(`Erro: ${err}. Tente novamente.`);
    } finally {
      setIsLoading(false);
    }
  };
=======
// @/app/login/page.tsx
import LoginForm from "@/components/Forms/LoginForm";
import Header from "@/components/Header";
>>>>>>> prod

export default async function Loginpage (){
  return (
    <main>
      <div>
        <Header/>
      </div>
      <div>
        <LoginForm/>
      </div>
    </main>
  );
}