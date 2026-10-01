import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { popups } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

const unauthorized = (error: unknown) => error instanceof Error && error.message === "UNAUTHORIZED";
const mediaKey = (value: unknown) => {
  const key = value ? String(value) : null;
  return key && key.startsWith("cms/") ? key : null;
};

export async function GET() {
  try {
    await requireAdmin();
    return Response.json({ popups: await getDb().select().from(popups).orderBy(desc(popups.updatedAt), desc(popups.id)) });
  } catch (error) {
    return Response.json({ error: unauthorized(error) ? "Unauthorized" : "Pop-up records unavailable" }, { status: unauthorized(error) ? 401 : 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const input = await request.json() as Record<string, unknown>;
    const language = String(input.language ?? "en");
    if (!(["en", "tr"] as string[]).includes(language)) return Response.json({ error: "Invalid language" }, { status: 400 });
    const values = {
      language,
      message: String(input.message ?? "").slice(0, 12000),
      imageKey: mediaKey(input.imageKey),
      videoKey: mediaKey(input.videoKey),
      published: input.published !== false,
      updatedAt: new Date().toISOString(),
    };
    if (!values.message && !values.imageKey && !values.videoKey) return Response.json({ error: "Message or media is required" }, { status: 400 });
    const id = Number(input.id ?? 0);
    if (id) {
      await getDb().update(popups).set(values).where(eq(popups.id, id));
      return Response.json({ id });
    }
    const [row] = await getDb().insert(popups).values(values).returning();
    return Response.json(row, { status: 201 });
  } catch (error) {
    return Response.json({ error: unauthorized(error) ? "Unauthorized" : "Pop-up could not be saved" }, { status: unauthorized(error) ? 401 : 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const id = Number(new URL(request.url).searchParams.get("id"));
    if (!id) return Response.json({ error: "Invalid id" }, { status: 400 });
    await getDb().delete(popups).where(eq(popups.id, id));
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: unauthorized(error) ? "Unauthorized" : "Pop-up could not be deleted" }, { status: unauthorized(error) ? 401 : 500 });
  }
}
