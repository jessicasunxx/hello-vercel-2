import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      return NextResponse.json({
        hasUser: false,
        error: userError.message,
        hint: "Supabase getUser failed",
      });
    }

    if (!user) {
      return NextResponse.json({
        hasUser: false,
        hint: "No session - cookies may not be persisting. Check Supabase redirect URLs include your Vercel URL.",
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id,email,full_name,is_superadmin")
      .eq("id", user.id)
      .single();

    return NextResponse.json({
      hasUser: true,
      user: { id: user.id, email: user.email },
      profile: profileError
        ? { error: profileError.message }
        : {
            ...profile,
            hint: !profile?.is_superadmin
              ? "Run in Supabase: UPDATE profiles SET is_superadmin = true WHERE email = 'YOUR_EMAIL'"
              : "You have access",
          },
    });
  } catch (err) {
    return NextResponse.json({
      hasUser: false,
      error: err instanceof Error ? err.message : "Unknown error",
      hint: "Check Vercel env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY",
    });
  }
}
