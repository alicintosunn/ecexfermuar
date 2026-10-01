import { getDb } from "@/db";
import { contactMessages } from "@/db/schema";

export async function POST(request:Request){
 try{const p=await request.json() as Record<string,string>;if(!p.fullName||!p.email||!p.subject||!p.message)return Response.json({error:"Zorunlu alanları doldurun."},{status:400});await getDb().insert(contactMessages).values({fullName:String(p.fullName).slice(0,160),email:String(p.email).slice(0,240),phone:String(p.phone||"").slice(0,80),subject:String(p.subject).slice(0,240),message:String(p.message).slice(0,5000)});return Response.json({ok:true});}catch{return Response.json({error:"Mesaj gönderilemedi."},{status:500})}
}
