import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { productItems, productOptions } from "@/db/schema";
export async function GET(request:Request){try{const category=new URL(request.url).searchParams.get("category")||"metal";const [items,options]=await Promise.all([getDb().select().from(productItems).where(eq(productItems.category,category)).orderBy(asc(productItems.sortOrder),asc(productItems.id)),getDb().select().from(productOptions).where(eq(productOptions.category,category)).orderBy(asc(productOptions.sortOrder),asc(productOptions.id))]);return Response.json({items,options})}catch{return Response.json({items:[],options:[]})}}
