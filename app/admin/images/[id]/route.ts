import { NextRequest, NextResponse } from "next/server";
import { requireSuperadmin } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireSuperadmin();
  const { id } = await params;
  const supabase = await getSupabaseServerClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("images")
    .update({
      title: body.title,
      description: body.description,
      url: body.url,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireSuperadmin();
  const { id } = await params;
  const supabase = await getSupabaseServerClient();

  const { error } = await supabase.from("images").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
