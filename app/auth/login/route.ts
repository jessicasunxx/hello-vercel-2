import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const OAUTH_START_FAILED = "oauth_start_failed";

function buildFailureRedirect(origin: string, reason: string) {
  const url = new URL("/login", origin);
  url.searchParams.set("error", OAUTH_START_FAILED);
  url.searchParams.set("reason", reason.slice(0, 140));
  return NextResponse.redirect(url);
}

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
      const reason = error?.message || "No OAuth URL returned by Supabase";
      return buildFailureRedirect(origin, reason);
    }

    return NextResponse.redirect(data.url);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unexpected auth error";
    return buildFailureRedirect(origin, reason);
  }
}
