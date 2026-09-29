import { cookies } from "next/headers";

const COOKIE_NAME = "ecex_admin_session";
const SESSION_VALUE = "ecex-cms-admin-v1";

export async function isAdmin() {
  return (await cookies()).get(COOKIE_NAME)?.value === SESSION_VALUE;
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("UNAUTHORIZED");
}

export async function createAdminSession() {
  (await cookies()).set(COOKIE_NAME, SESSION_VALUE, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
}

export async function clearAdminSession() {
  (await cookies()).set(COOKIE_NAME, "", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
}
