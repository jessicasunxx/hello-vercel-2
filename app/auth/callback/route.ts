import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();

    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error) {
      console.error("[auth/callback] OAuth error:", error, errorDescription);
      return NextResponse.redirect(`${origin}/login?error=oauth&message=${encodeURIComponent(errorDescription || error)}`);
    }

    if (code) {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error("[auth/callback] Exchange error:", exchangeError);
        return NextResponse.redirect(`${origin}/login?error=config`);
      }

      return NextResponse.redirect(`${origin}/`);
    }

    return NextResponse.redirect(`${origin}/login`);
  } catch (err) {
    console.error("[auth/callback] Exception:", err);
    return NextResponse.redirect(`${request.nextUrl.origin}/login?error=config`);
  }
}

