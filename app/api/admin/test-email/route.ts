import { getDb } from "@/db";
import { siteSettings } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { sendSmtpMail } from "@/lib/smtp";

export async function POST(request:Request){
 try{await requireAdmin();const {email}=await request.json() as {email?:string};if(!email||!email.includes("@"))return Response.json({error:"Geçerli bir test e-posta adresi girin."},{status:400});const rows=await getDb().select().from(siteSettings),s=Object.fromEntries(rows.map(x=>[x.key,x.value]));await sendSmtpMail(s,{to:email,subject:"ECEX SMTP Test Mesajı",text:"SMTP ayarlarınız başarıyla çalışıyor.",html:"<p><strong>SMTP ayarlarınız başarıyla çalışıyor.</strong></p>"});return Response.json({ok:true,message:"Test e-postası gönderildi."});}catch(e){const message=e instanceof Error?e.message:"Bilinmeyen SMTP hatası";return Response.json({error:message==="UNAUTHORIZED"?"Unauthorized":`Test e-postası gönderilemedi: ${message}`},{status:message==="UNAUTHORIZED"?401:500})}
}
