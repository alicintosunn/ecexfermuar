import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { getDb } from "@/db";
import { adminSessions } from "@/db/schema";

const COOKIE_NAME = "ecex_admin_session";
const SESSION_HOURS = 8;
const hex = (bytes: Uint8Array) => Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
const unhex = (value: string) => new Uint8Array(value.match(/.{1,2}/g)?.map(v => parseInt(v, 16)) ?? []);

export async function hashPassword(password: string) {
  const iterations = 120000; const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
  return `${iterations}.${hex(salt)}.${hex(new Uint8Array(bits))}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [count, salt, expected] = stored.split("."); if (!count || !salt || !expected) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: unhex(salt), iterations: Number(count) }, key, 256);
  const actual = hex(new Uint8Array(bits)); if (actual.length !== expected.length) return false;
  let mismatch = 0; for (let i = 0; i < actual.length; i++) mismatch |= actual.charCodeAt(i) ^ expected.charCodeAt(i); return mismatch === 0;
}

export async function isAdmin() {
  const token = (await cookies()).get(COOKIE_NAME)?.value; if (!token) return false;
  const rows = await getDb().select().from(adminSessions).where(and(eq(adminSessions.token, token), gt(adminSessions.expiresAt, new Date().toISOString()))).limit(1);
  return rows.length === 1;
}
export async function requireAdmin() { if (!(await isAdmin())) throw new Error("UNAUTHORIZED"); }
export async function createAdminSession(userId: number | null, isDefaultAdmin = false) {
  const token = crypto.randomUUID() + crypto.randomUUID(); const expiresAt = new Date(Date.now() + SESSION_HOURS * 3600_000).toISOString();
  await getDb().insert(adminSessions).values({ token, userId, isDefaultAdmin, expiresAt });
  (await cookies()).set(COOKIE_NAME, token, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_HOURS * 3600 });
}
export async function clearAdminSession() {
  const jar = await cookies(); const token = jar.get(COOKIE_NAME)?.value; if (token) await getDb().delete(adminSessions).where(eq(adminSessions.token, token));
  jar.set(COOKIE_NAME, "", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
}
