"use server";
import { loginUser } from "@/lib/auth";
import { cookies } from "next/headers";

export async function loginAction(email: string, password: string) {
  const { token, user } = await loginUser({ email, password });

  // Guardar JWT em cookie HttpOnly
  (await
        // Guardar JWT em cookie HttpOnly
        cookies()).set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });

  return { success: true, user };
}
