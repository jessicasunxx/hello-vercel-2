import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    const origin = request.nextUrl.origin;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error || !data.url) {
      return NextResponse.redirect(`${origin}/login?error=config`);
    }

    return NextResponse.redirect(data.url);
  } catch {
    return NextResponse.redirect(`${request.nextUrl.origin}/login?error=config`);
  }
}
