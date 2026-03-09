import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;

  try {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error || !data.url) {
      return NextResponse.redirect(`${origin}/login?error=oauth_start_failed`);
    }

    return NextResponse.redirect(data.url);
  } catch {
    return NextResponse.redirect(`${origin}/login?error=oauth_start_failed`);
  }
}
