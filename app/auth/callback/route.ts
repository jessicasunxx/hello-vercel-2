import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    const url =
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
    const anonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      return NextResponse.redirect(`${origin}/login?error=config`);
    }

    if (error) {
      console.error("[auth/callback] OAuth error:", error, errorDescription);
      return NextResponse.redirect(
        `${origin}/login?error=oauth&message=${encodeURIComponent(errorDescription || error)}`
      );
    }

    if (code) {
      const cookieStore = await cookies();

      // Create the redirect response first so we can attach cookies to it.
      // Setting cookies on the response we return ensures they're sent to the browser.
      const response = NextResponse.redirect(`${origin}/admin`);

      const supabase = createServerClient(url, anonKey, {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      });

      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error("[auth/callback] Exchange error:", exchangeError);
        return NextResponse.redirect(`${origin}/login?error=config`);
      }

      return response;
    }

    return NextResponse.redirect(`${origin}/admin`);
  } catch (err) {
    console.error("[auth/callback] Exception:", err);
    return NextResponse.redirect(
      `${request.nextUrl.origin}/login?error=config`
    );
  }
}

