import { getDb } from "@/db";
import { contentSections } from "@/db/schema";

export async function GET() {
  try { return Response.json({ sections: await getDb().select().from(contentSections) },{headers:{"cache-control":"public, max-age=60, stale-while-revalidate=600"}}); }
  catch { return Response.json({ sections: [], unavailable: true }); }
}
