import { NextRequest, NextResponse } from "next/server";
import { requireSuperadmin } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  await requireSuperadmin();
  const supabase = await getSupabaseServerClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("images")
    .insert({
      title: body.title,
      description: body.description,
      url: body.url,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
