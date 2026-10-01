import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { blogPosts } from "@/db/schema";
export async function GET() { try { const posts = await getDb().select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt)); return Response.json({ posts },{headers:{"cache-control":"public, max-age=60, stale-while-revalidate=600"}}); } catch { return Response.json({ posts: [], unavailable: true }); } }
