import { createServerClient } from "@supabase/ssr";
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
      const cookiesToSet: { name: string; value: string; options?: object }[] =
        [];

      const supabase = createServerClient(url, anonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookies) {
            cookies.forEach(({ name, value, options }) =>
              cookiesToSet.push({ name, value, options })
            );
          },
        },
      });

      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        console.error("[auth/callback] Exchange error:", exchangeError);
        return NextResponse.redirect(`${origin}/login?error=config`);
      }

      const response = NextResponse.redirect(`${origin}/`);
      cookiesToSet.forEach(({ name, value, options }) =>
        response.cookies.set(name, value, options)
      );
      return response;
    }

    return NextResponse.redirect(`${origin}/login`);
  } catch (err) {
    console.error("[auth/callback] Exception:", err);
    return NextResponse.redirect(
      `${request.nextUrl.origin}/login?error=config`
    );
  }
}

