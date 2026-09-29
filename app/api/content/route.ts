import { getDb } from "@/db";
import { contentSections } from "@/db/schema";

export async function GET() {
  try { return Response.json({ sections: await getDb().select().from(contentSections) }); }
  catch { return Response.json({ sections: [], unavailable: true }); }
}
