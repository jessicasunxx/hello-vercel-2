"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginCard() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setIsLoading(false);
      // eslint-disable-next-line no-alert
      alert(`Login failed: ${error.message}`);
    }
  };

  const handleReturn = () => {
    router.push("/");
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur-sm">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">
          Secure Access
        </p>
        <h1 className="text-3xl font-semibold text-white">
          Sign in with Google
        </h1>
        <p className="text-sm leading-6 text-zinc-400">
          Admin access is limited to verified superadmins.
        </p>
      </div>
      <button
        type="button"
        onClick={handleLogin}
        className="mt-8 w-full rounded-xl bg-cyan-500/20 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400 transition hover:bg-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isLoading}
      >
        {isLoading ? "Redirecting..." : "Continue with Google"}
      </button>
      <button
        type="button"
        onClick={handleReturn}
        className="mt-4 w-full rounded-xl border border-white/10 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 transition hover:border-white/20 hover:bg-white/5 hover:text-zinc-300"
      >
        Back to landing
      </button>
    </div>
  );
}
