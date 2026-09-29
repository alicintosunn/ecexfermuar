import { createAdminSession, isAdmin } from "@/lib/admin-auth";

export async function GET() { return Response.json({ authenticated: await isAdmin() }); }
export async function POST(request: Request) {
  const { username, password } = await request.json() as { username?: string; password?: string };
  if (username !== "admin" || password !== "admin") return Response.json({ error: "Kullanıcı adı veya şifre hatalı." }, { status: 401 });
  await createAdminSession(); return Response.json({ ok: true });
}
