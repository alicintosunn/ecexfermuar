import { sql } from "drizzle-orm";
import { getDb } from "@/db";
import { adminUsers,blogPosts,contactMessages,contentSections,popups,productItems,productOptions,siteSettings } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export const runtime="nodejs";
const tables={contentSections,blogPosts,siteSettings,adminUsers,productItems,productOptions,contactMessages,popups};
type BackupData={schemaVersion:1;createdAt:string;application:"ecexfermuar";data:{[K in keyof typeof tables]:unknown[]}};

export async function GET(){
 try{
  await requireAdmin();
  const db=getDb();
  const [sections,posts,settings,users,items,options,messages,popupRows]=await Promise.all([db.select().from(contentSections),db.select().from(blogPosts),db.select().from(siteSettings),db.select().from(adminUsers),db.select().from(productItems),db.select().from(productOptions),db.select().from(contactMessages),db.select().from(popups)]);
  const backup:BackupData={schemaVersion:1,createdAt:new Date().toISOString(),application:"ecexfermuar",data:{contentSections:sections,blogPosts:posts,siteSettings:settings,adminUsers:users,productItems:items,productOptions:options,contactMessages:messages,popups:popupRows}};
  const date=new Date().toISOString().slice(0,10);
  return new Response(JSON.stringify(backup,null,2),{headers:{"content-type":"application/json; charset=utf-8","content-disposition":`attachment; filename="ecex-yedek-${date}.json"`,"cache-control":"private, no-store","x-content-type-options":"nosniff"}});
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
