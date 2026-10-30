import { sql } from "drizzle-orm";
import { getDb } from "@/db";
import { adminUsers,blogPosts,contactMessages,contentSections,popups,productItems,productOptions,siteSettings } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin, storageBucket } from "@/lib/supabase-server";

export const runtime="nodejs";
const tables={contentSections,blogPosts,siteSettings,adminUsers,productItems,productOptions,contactMessages,popups};
type BackupData={schemaVersion:1;createdAt:string;application:"ecexfermuar";data:{[K in keyof typeof tables]:unknown[]}};

async function createDatabaseBackup():Promise<BackupData>{
 const db=getDb();
 // Keep backup reads sequential. Supavisor transaction pooling can retain a
 // connection while a large Promise.all queue is still waiting, which makes a
 // browser download appear to hang even though the individual queries finish.
 const sections=await db.select().from(contentSections);
 const posts=await db.select().from(blogPosts);
 const settings=await db.select().from(siteSettings);
 const users=await db.select().from(adminUsers);
 const items=await db.select().from(productItems);
 const options=await db.select().from(productOptions);
 const messages=await db.select().from(contactMessages);
 const popupRows=await db.select().from(popups);
 return {schemaVersion:1,createdAt:new Date().toISOString(),application:"ecexfermuar",data:{contentSections:sections,blogPosts:posts,siteSettings:settings,adminUsers:users,productItems:items,productOptions:options,contactMessages:messages,popups:popupRows}};
}

async function listMedia(){
 const {data,error}=await getSupabaseAdmin().storage.from(storageBucket).list("cms",{limit:1000,sortBy:{column:"name",order:"asc"}});
 if(error)throw error;
 return (data??[]).filter(file=>file.id).map(file=>({key:`cms/${file.name}`,size:Number(file.metadata?.size||0),contentType:String(file.metadata?.mimetype||"application/octet-stream")}));
}

async function databaseStorageBytes(){
 const rows=await getDb().execute(sql`select coalesce(sum(pg_total_relation_size((quote_ident(schemaname)||'.'||quote_ident(tablename))::regclass)),0)::bigint as bytes from pg_tables where schemaname='public' and tablename in ('content_sections','blog_posts','site_settings','admin_users','product_items','product_options','contact_messages','popups')`);
 const [row]=Array.from(rows as unknown as Iterable<{bytes:string|number}>);
 return Number(row?.bytes||0);
}

export async function GET(request:Request){
 try{
  await requireAdmin();
  const mode=new URL(request.url).searchParams.get("mode");
  if(mode==="summary"){
   const [databaseBytes,media]=await Promise.all([databaseStorageBytes(),listMedia()]),mediaBytes=media.reduce((sum,file)=>sum+file.size,0);
   return Response.json({databaseBytes,mediaBytes,totalBytes:databaseBytes+mediaBytes,mediaCount:media.length},{headers:{"cache-control":"private, no-store"}});
  }
  const [backup,media]=await Promise.all([createDatabaseBackup(),listMedia()]);
  return Response.json({formatVersion:2,application:"ecexfermuar",createdAt:new Date().toISOString(),database:backup,media},{headers:{"cache-control":"private, no-store","x-content-type-options":"nosniff"}});
 }catch(error){return Response.json({error:error instanceof Error&&error.message==="UNAUTHORIZED"?"Unauthorized":"Yedek oluşturulamadı."},{status:error instanceof Error&&error.message==="UNAUTHORIZED"?401:500})}
}

export async function POST(request:Request){
 try{
  await requireAdmin();
  const length=Number(request.headers.get("content-length")||0);if(length>10*1024*1024)return Response.json({error:"Yedek dosyası 10 MB sınırını aşıyor."},{status:413});
  const raw=await request.text();
  if(new TextEncoder().encode(raw).byteLength>10*1024*1024)return Response.json({error:"Yedek dosyası 10 MB sınırını aşıyor."},{status:413});
  let backup:Partial<BackupData>;
  try{backup=JSON.parse(raw) as Partial<BackupData>}catch{return Response.json({error:"Geçersiz JSON yedek dosyası."},{status:400})}
  if(backup.schemaVersion!==1||backup.application!=="ecexfermuar"||!backup.data)return Response.json({error:"Geçersiz veya desteklenmeyen ECEX yedek dosyası."},{status:400});
  for(const key of Object.keys(tables) as (keyof typeof tables)[])if(!Array.isArray(backup.data[key]))return Response.json({error:`Yedek dosyasında ${key} verisi eksik.`},{status:400});
  const data=backup.data as BackupData["data"],db=getDb();
  await db.transaction(async tx=>{
   await tx.delete(productOptions);await tx.delete(productItems);await tx.delete(blogPosts);await tx.delete(contactMessages);await tx.delete(popups);await tx.delete(contentSections);await tx.delete(siteSettings);await tx.delete(adminUsers);
   if(data.contentSections.length)await tx.insert(contentSections).values(data.contentSections as typeof contentSections.$inferInsert[]);
   if(data.blogPosts.length)await tx.insert(blogPosts).values(data.blogPosts as typeof blogPosts.$inferInsert[]);
   if(data.siteSettings.length)await tx.insert(siteSettings).values(data.siteSettings as typeof siteSettings.$inferInsert[]);
   if(data.adminUsers.length)await tx.insert(adminUsers).values(data.adminUsers as typeof adminUsers.$inferInsert[]);
   if(data.productItems.length)await tx.insert(productItems).values(data.productItems as typeof productItems.$inferInsert[]);
   if(data.productOptions.length)await tx.insert(productOptions).values(data.productOptions as typeof productOptions.$inferInsert[]);
   if(data.contactMessages.length)await tx.insert(contactMessages).values(data.contactMessages as typeof contactMessages.$inferInsert[]);
   if(data.popups.length)await tx.insert(popups).values(data.popups as typeof popups.$inferInsert[]);
   await tx.execute(sql`select setval(pg_get_serial_sequence('blog_posts','id'), coalesce((select max(id) from blog_posts),1), exists(select 1 from blog_posts))`);
   await tx.execute(sql`select setval(pg_get_serial_sequence('admin_users','id'), coalesce((select max(id) from admin_users),1), exists(select 1 from admin_users))`);
   await tx.execute(sql`select setval(pg_get_serial_sequence('product_items','id'), coalesce((select max(id) from product_items),1), exists(select 1 from product_items))`);
   await tx.execute(sql`select setval(pg_get_serial_sequence('product_options','id'), coalesce((select max(id) from product_options),1), exists(select 1 from product_options))`);
   await tx.execute(sql`select setval(pg_get_serial_sequence('contact_messages','id'), coalesce((select max(id) from contact_messages),1), exists(select 1 from contact_messages))`);
   await tx.execute(sql`select setval(pg_get_serial_sequence('popups','id'), coalesce((select max(id) from popups),1), exists(select 1 from popups))`);
  });
  return Response.json({ok:true,message:"Yedek başarıyla geri yüklendi."});
 }catch(error){console.error("Backup restore failed",error instanceof Error?error.message:error);return Response.json({error:error instanceof Error&&error.message==="UNAUTHORIZED"?"Unauthorized":"Yedek geri yüklenemedi. Mevcut veriler korunmuştur."},{status:error instanceof Error&&error.message==="UNAUTHORIZED"?401:500})}
}
