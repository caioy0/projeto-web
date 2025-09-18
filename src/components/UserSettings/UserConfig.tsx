// @/components/UserSettings/UserConfig.tsx
"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  updateUserSettings,
  updateUserPassword,
  toggleUserActive,
} from "@/actions/settings";

export default function UserConfig() {
  const [user, setUser] = useState<{ name: string; email: string; active: boolean } | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  const [active, setActive] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Busca o usuário logado ao montar
  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/user-settings", { cache: "no-store" });
        if (!res.ok) throw new Error("Não foi possível buscar o usuário.");
        const data = await res.json();
        setUser(data);
        setFormData({ name: data.name, email: data.email });
        setActive(data.active);
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : "Erro ao carregar usuário.";
        setErrors({ submit: errMsg });
        router.push("/login"); // redireciona se não estiver logado
      }
    });
  }, [router]);

  if (!user) return <div>Loading...</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccessMsg("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccessMsg("");
  };

  const handleUpdateUser = () => {
    startTransition(async () => {
      try {
        const updated = await updateUserSettings(formData);
        setUser(updated);
        setFormData({ name: updated.name, email: updated.email });
        setSuccessMsg("Dados atualizados com sucesso!");
        setErrors({});
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : "Erro ao atualizar dados.";
        setErrors({ submit: errMsg });
      }
    });
  };

  const handleUpdatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setErrors({ confirmNewPassword: "Passwords do not match" });
      return;
    }
    startTransition(async () => {
      try {
        const res = await updateUserPassword({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        });
        setSuccessMsg(res.message);
        setErrors({});
        setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : "Erro ao atualizar senha.";
        setErrors({ submit: errMsg });
      }
    });
  };

  const handleToggleActive = () => {
    startTransition(async () => {
      try {
        const updated = await toggleUserActive();
        setActive(updated.active);
        setSuccessMsg(`Conta ${updated.active ? "ativada" : "desativada"} com sucesso!`);
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : "Erro ao atualizar status da conta.";
        setErrors({ submit: errMsg });
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-6">
      <h1 className="text-2xl font-bold">User Settings</h1>

      {errors.submit && <div className="text-red-600">{errors.submit}</div>}
      {successMsg && <div className="text-green-600">{successMsg}</div>}

      {/* User Info */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Profile</h2>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleUpdateUser}
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Save Profile
        </button>
      </div>

      {/* Password */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <input
          type="password"
          name="currentPassword"
          value={passwordData.currentPassword}
          onChange={handlePasswordChange}
          placeholder="Current Password"
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
          placeholder="New Password"
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="confirmNewPassword"
          value={passwordData.confirmNewPassword}
          onChange={handlePasswordChange}
          placeholder="Confirm New Password"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleUpdatePassword}
          disabled={isPending}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Update Password
        </button>
      </div>

      {/* Active Toggle */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Account Status</h2>
        <p>Status: {active ? "Active" : "Inactive"}</p>
        <button
          onClick={handleToggleActive}
          disabled={isPending}
          className={`px-4 py-2 rounded text-white ${
            active ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 hover:bg-gray-700"
          } disabled:opacity-50`}
        >
          {active ? "Deactivate Account" : "Activate Account"}
        </button>
      </div>
    </div>
  );
}
