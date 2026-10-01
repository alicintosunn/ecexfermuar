import { desc,eq } from "drizzle-orm";
import { getDb } from "@/db";
import { contactMessages } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(){try{await requireAdmin();return Response.json({messages:await getDb().select().from(contactMessages).orderBy(desc(contactMessages.id))});}catch{return Response.json({error:"Unauthorized"},{status:401})}}
export async function DELETE(request:Request){try{await requireAdmin();const id=Number(new URL(request.url).searchParams.get("id"));if(id)await getDb().delete(contactMessages).where(eq(contactMessages.id,id));return Response.json({ok:true});}catch{return Response.json({error:"Silinemedi."},{status:500})}}
