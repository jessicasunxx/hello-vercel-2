import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function redirectToLoginWithReason(origin: string, reason: string) {
  const url = new URL("/login", origin);
  url.searchParams.set("error", "oauth_callback_failed");
  url.searchParams.set("reason", reason.slice(0, 160));
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  try {
    const supabase = await getSupabaseServerClient();

    const providerError =
      searchParams.get("error_description") ?? searchParams.get("error");

    if (providerError) {
      return redirectToLoginWithReason(origin, providerError);
    }

    const code = searchParams.get("code");

    if (!code) {
      return redirectToLoginWithReason(origin, "Missing OAuth authorization code");
    }

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      return redirectToLoginWithReason(origin, exchangeError.message);
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return redirectToLoginWithReason(
        origin,
        userError?.message || "Session was not persisted after OAuth callback",
      );
    }

    return NextResponse.redirect(`${origin}/admin`);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "OAuth callback handler failed";
    return redirectToLoginWithReason(origin, reason);
  }
}
