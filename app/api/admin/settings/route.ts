import { getDb } from "@/db";
import { siteSettings } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

const allowed=["logoKey","smtpHost","smtpPort","smtpSecure","smtpUser","smtpPassword","contactDefaultEmail","sliderImages","popupEnabled","popupMessageEn","popupMessageTr","popupImageKey","popupVideoKey"];
export async function GET(){try{await requireAdmin();const rows=await getDb().select().from(siteSettings);return Response.json({settings:Object.fromEntries(rows.map(x=>[x.key,x.value]))});}catch{return Response.json({error:"Unauthorized"},{status:401})}}
export async function PUT(request:Request){try{await requireAdmin();const p=await request.json() as Record<string,string>;for(const key of allowed){if(key in p)await getDb().insert(siteSettings).values({key,value:String(p[key]??""),updatedAt:new Date().toISOString()}).onConflictDoUpdate({target:siteSettings.key,set:{value:String(p[key]??""),updatedAt:new Date().toISOString()}})}return Response.json({ok:true});}catch{return Response.json({error:"Ayarlar kaydedilemedi."},{status:500})}}
