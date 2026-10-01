import { getSupabaseAdmin, storageBucket } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: Promise<{ key?: string[] }> }) {
  const key = (await params).key?.join("/");
  if (!key || !key.startsWith("cms/") || key.includes("..")) return new Response("Not found", { status: 404 });
  try {
    const { data, error } = await getSupabaseAdmin().storage.from(storageBucket).download(key);
    if (error || !data) return new Response("Not found", { status: 404 });
    return new Response(data.stream(), { headers: { "content-type": data.type || "application/octet-stream", "content-length": String(data.size), "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff", "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; media-src 'self'; img-src 'self'" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
