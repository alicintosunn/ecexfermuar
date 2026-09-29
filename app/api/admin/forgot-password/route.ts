import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { adminUsers, passwordResetTokens, siteSettings } from "@/db/schema";

export async function POST(request:Request){
  const {email}=await request.json() as {email?:string}; const generic={ok:true,message:"Hesap bulunursa şifre yenileme bağlantısı e-posta adresine gönderilecektir."};
  if(!email)return Response.json(generic); const [user]=await getDb().select().from(adminUsers).where(eq(adminUsers.email,email.trim().toLowerCase())).limit(1); if(!user)return Response.json(generic);
  const token=crypto.randomUUID()+crypto.randomUUID(); await getDb().insert(passwordResetTokens).values({token,userId:user.id,expiresAt:new Date(Date.now()+30*60_000).toISOString()});
  const rows=await getDb().select().from(siteSettings); const s=Object.fromEntries(rows.map(x=>[x.key,x.value])); const resetUrl=`${new URL(request.url).origin}/adminpanel?reset=${encodeURIComponent(token)}`;
  if(s.smtpGatewayUrl){try{await fetch(s.smtpGatewayUrl,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({smtp:{host:s.smtpHost,port:Number(s.smtpPort||587),secure:s.smtpSecure==="true",username:s.smtpUser,password:s.smtpPassword},from:{name:s.smtpFromName||"ECEX",email:s.smtpFromEmail},to:{name:`${user.firstName} ${user.lastName}`,email:user.email},subject:"ECEX Yönetim Paneli Şifre Yenileme",text:`Şifrenizi yenilemek için 30 dakika içinde bu bağlantıyı açın: ${resetUrl}`,html:`<p>Şifrenizi yenilemek için 30 dakika içinde aşağıdaki bağlantıyı açın:</p><p><a href="${resetUrl}">Yeni şifre oluştur</a></p>`})});}catch{}}
  return Response.json(generic);
}
