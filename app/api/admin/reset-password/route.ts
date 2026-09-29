import { and, eq, gt } from "drizzle-orm";
import { getDb } from "@/db";
import { adminUsers, passwordResetTokens } from "@/db/schema";
import { hashPassword } from "@/lib/admin-auth";

export async function POST(request:Request){const {token,password}=await request.json() as {token?:string,password?:string};if(!token||!password||password.length<8)return Response.json({error:"Geçersiz bağlantı veya kısa şifre."},{status:400});const [row]=await getDb().select().from(passwordResetTokens).where(and(eq(passwordResetTokens.token,token),eq(passwordResetTokens.used,false),gt(passwordResetTokens.expiresAt,new Date().toISOString()))).limit(1);if(!row)return Response.json({error:"Bağlantı geçersiz veya süresi dolmuş."},{status:400});await getDb().batch([getDb().update(adminUsers).set({passwordHash:await hashPassword(password)}).where(eq(adminUsers.id,row.userId)),getDb().update(passwordResetTokens).set({used:true}).where(eq(passwordResetTokens.token,token))]);return Response.json({ok:true});}
