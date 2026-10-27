import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin, storageBucket } from "@/lib/supabase-server";

export const runtime="nodejs";

export async function POST(request:Request){
 try{
  await requireAdmin();
  const input=await request.json() as {key?:string},key=String(input.key||"");
  if(!/^cms\/[a-zA-Z0-9._-]+$/.test(key))return Response.json({error:"Geçersiz medya anahtarı."},{status:400});
  const {data,error}=await getSupabaseAdmin().storage.from(storageBucket).createSignedUploadUrl(key,{upsert:true});
  if(error||!data)throw error||new Error("Signed upload URL unavailable");
  return Response.json({key,token:data.token,bucket:storageBucket});
 }catch(error){
  console.error("Backup media restore failed",error instanceof Error?error.message:error);
  return Response.json({error:error instanceof Error&&error.message==="UNAUTHORIZED"?"Unauthorized":"Medya geri yükleme bağlantısı oluşturulamadı."},{status:error instanceof Error&&error.message==="UNAUTHORIZED"?401:500});
 }
}
