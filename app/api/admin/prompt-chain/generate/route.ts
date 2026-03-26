import { NextResponse } from "next/server";
import { generateCaptionsWithAlmostCrackd } from "@/lib/almostcrackd-captions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function POST(request: Request) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { imageUrl?: string; humorFlavorId?: string };
  try {
    body = (await request.json()) as { imageUrl?: string; humorFlavorId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const imageUrl = body.imageUrl?.trim();
  const humorFlavorId = body.humorFlavorId?.trim();
  if (!imageUrl || !humorFlavorId) {
    return NextResponse.json(
      { error: "imageUrl and humorFlavorId are required" },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  try {
    const result = await generateCaptionsWithAlmostCrackd({
      imageUrl,
      humorFlavorId,
      accessToken: session?.access_token ?? null,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Request failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
