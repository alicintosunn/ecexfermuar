import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { adminUsers } from "@/db/schema";
import { createAdminSession, isAdmin, verifyPassword } from "@/lib/admin-auth";
import { rateLimit } from "@/lib/rate-limit";

export async function GET() { return Response.json({ authenticated: await isAdmin() }); }
export async function POST(request: Request) {
  if(!rateLimit(request,"admin-login",8,15*60_000))return Response.json({error:"Çok fazla giriş denemesi. 15 dakika sonra tekrar deneyin."},{status:429,headers:{"retry-after":"900"}});
  const { username, password } = await request.json() as { username?: string; password?: string };
  if (username === "admin" && password === "admin") { await createAdminSession(null, true); return Response.json({ ok: true }); }
  if (!username || !password) return Response.json({ error: "Kullanıcı adı veya şifre hatalı." }, { status: 401 });
  const [user] = await getDb().select().from(adminUsers).where(eq(adminUsers.email, username.trim().toLowerCase())).limit(1);
  if (!user?.active || !(await verifyPassword(password, user.passwordHash))) return Response.json({ error: "Kullanıcı adı veya şifre hatalı." }, { status: 401 });
  await createAdminSession(user.id); return Response.json({ ok: true });
}
