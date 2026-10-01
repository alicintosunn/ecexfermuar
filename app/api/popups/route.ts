import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { popups } from "@/db/schema";

export async function GET(request: Request) {
  try {
    const language = new URL(request.url).searchParams.get("lang") === "tr" ? "tr" : "en";
    const rows = await getDb().select().from(popups).where(and(eq(popups.language, language), eq(popups.published, true))).orderBy(desc(popups.updatedAt), desc(popups.id));
    return Response.json({ popups: rows }, { headers: { "cache-control": "no-store" } });
  } catch {
    return Response.json({ popups: [], unavailable: true }, { headers: { "cache-control": "no-store" } });
  }
}
