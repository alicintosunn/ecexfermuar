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
 const [sections,posts,settings,users,items,options,messages,popupRows]=await Promise.all([db.select().from(contentSections),db.select().from(blogPosts),db.select().from(siteSettings),db.select().from(adminUsers),db.select().from(productItems),db.select().from(productOptions),db.select().from(contactMessages),db.select().from(popups)]);
 return {schemaVersion:1,createdAt:new Date().toISOString(),application:"ecexfermuar",data:{contentSections:sections,blogPosts:posts,siteSettings:settings,adminUsers:users,productItems:items,productOptions:options,contactMessages:messages,popups:popupRows}};
}

async function listMedia(){
 const storage=getSupabaseAdmin().storage.from(storageBucket),files:{key:string;size:number;contentType:string}[]=[];
 for(let offset=0;;offset+=1000){
  const {data,error}=await storage.list("cms",{limit:1000,offset,sortBy:{column:"name",order:"asc"}});
  if(error)throw error;
  for(const item of data||[])if(item.id)files.push({key:`cms/${item.name}`,size:Number(item.metadata?.size||0),contentType:String(item.metadata?.mimetype||"application/octet-stream")});
  if(!data||data.length<1000)break;
 }
 return files;
}

export async function GET(request:Request){
 try{
  await requireAdmin();
  const mode=new URL(request.url).searchParams.get("mode"),[backup,media]=await Promise.all([createDatabaseBackup(),listMedia()]);
  const databaseBytes=new TextEncoder().encode(JSON.stringify(backup)).byteLength,mediaBytes=media.reduce((sum,file)=>sum+file.size,0);
  if(mode==="summary")return Response.json({databaseBytes,mediaBytes,totalBytes:databaseBytes+mediaBytes,mediaCount:media.length},{headers:{"cache-control":"private, no-store"}});
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
