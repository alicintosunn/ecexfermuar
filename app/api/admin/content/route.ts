import { getDb } from "@/db";
import { contentSections } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() { try { await requireAdmin(); return Response.json({ sections: await getDb().select().from(contentSections) }); } catch (e) { return Response.json({ error: e instanceof Error && e.message === "UNAUTHORIZED" ? "Unauthorized" : "Content storage unavailable" }, { status: e instanceof Error && e.message === "UNAUTHORIZED" ? 401 : 500 }); } }
export async function PUT(request: Request) {
  try {
    await requireAdmin(); const p = await request.json() as { key?: string; titleEn?: string; titleTr?: string; bodyEn?: string; bodyTr?: string; imageKey?: string | null };
    if (!p.key) return Response.json({ error: "Key is required" }, { status: 400 });
    const values = { key: p.key, titleEn: p.titleEn ?? "", titleTr: p.titleTr ?? "", bodyEn: p.bodyEn ?? "", bodyTr: p.bodyTr ?? "", imageKey: p.imageKey ?? null, updatedAt: new Date().toISOString() };
    await getDb().insert(contentSections).values(values).onConflictDoUpdate({ target: contentSections.key, set: values });
    return Response.json({ section: values });
  } catch (e) { return Response.json({ error: e instanceof Error && e.message === "UNAUTHORIZED" ? "Unauthorized" : "Content could not be saved" }, { status: e instanceof Error && e.message === "UNAUTHORIZED" ? 401 : 500 }); }
}
