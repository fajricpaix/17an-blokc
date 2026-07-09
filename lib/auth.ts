import { createHash } from "crypto";
import { cookies } from "next/headers";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "panitia@blokc.id";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "merdeka17";
const SECRET = process.env.AUTH_SECRET ?? "sl-blokc-17an-secret";

export const SESSION_COOKIE = "blokc_session";

export function sessionToken(): string {
  return createHash("sha256")
    .update(`${ADMIN_EMAIL}:${ADMIN_PASSWORD}:${SECRET}`)
    .digest("hex");
}

export function verifyCredentials(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value === sessionToken();
}
