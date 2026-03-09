import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    const origin = request.nextUrl.origin;
    const redirectTo = `${origin}/auth/callback`;

    console.log("[auth/login] Starting OAuth flow", { origin, redirectTo });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      console.error("[auth/login] OAuth error:", error);
      return NextResponse.redirect(`${origin}/login?error=config`);
    }

    if (!data?.url) {
      console.error("[auth/login] No OAuth URL returned");
      return NextResponse.redirect(`${origin}/login?error=config`);
    }

    console.log("[auth/login] Redirecting to OAuth URL:", data.url);
    return NextResponse.redirect(data.url);
  } catch (err) {
    console.error("[auth/login] Exception:", err);
    return NextResponse.redirect(`${request.nextUrl.origin}/login?error=config`);
  }
}
