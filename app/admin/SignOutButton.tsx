"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-xl border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 transition hover:border-white/40 hover:bg-white/5 hover:text-white"
    >
      Sign out
    </button>
  );
}
