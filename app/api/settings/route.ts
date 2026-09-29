import { eq, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { siteSettings } from "@/db/schema";
export async function GET(){try{const rows=await getDb().select().from(siteSettings).where(inArray(siteSettings.key,["logoKey"]));return Response.json({settings:Object.fromEntries(rows.map(x=>[x.key,x.value]))});}catch{return Response.json({settings:{}})}}
