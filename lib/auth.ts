import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  is_superadmin: boolean;
  avatar_url?: string | null;
};

export async function requireSuperadmin() {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id,email,full_name,is_superadmin,avatar_url")
    .eq("id", user.id)
    .single<Profile>();

  if (profileError || !profile?.is_superadmin) {
    redirect("/login?error=not_authorized");
  }

  return { user, profile };
}

