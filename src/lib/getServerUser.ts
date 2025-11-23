import { cookies } from "next/headers";
import { getCurrentUser } from "./auth";

export async function getServerUser() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  return getCurrentUser(token);
}
