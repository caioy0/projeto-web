// @/lib/getServerUser.ts
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function getServerUser() {
  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get("session")?.value;
  if (!sessionToken) return null;

  // Busca o usuário pelo ID que você gravou no cookie
  const user = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: { id: true, email: true, name: true, active: true },
  });

  return user && user.active ? user : null;
}
