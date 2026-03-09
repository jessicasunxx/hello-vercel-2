"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function LoginInner() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/40 backdrop-blur">
        <h1 className="mb-2 text-center text-2xl font-semibold text-slate-50">
          Admin Console Login
        </h1>
        <p className="mb-6 text-center text-sm text-slate-400">
          Sign in with your Google account. Only{" "}
          <span className="font-semibold text-slate-200">superadmins</span> can
          access the dashboard.
        </p>

        {error === "not_authorized" && (
          <div className="mb-4 rounded-lg border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
            Your account is not marked as a superadmin in the{" "}
            <span className="font-mono">profiles</span> table
            <span className="font-semibold"> (profiles.is_superadmin)</span>.
          </div>
        )}

        {error === "config" && (
          <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 text-xs text-red-100">
            Configuration error: Missing Supabase environment variables. Please check your Vercel project settings.
          </div>
        )}

        <a
          href="/auth/login"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-sky-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-sky-500/40 transition hover:bg-sky-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="h-5 w-5"
          >
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.7 31.9 29.3 35 24 35a11 11 0 0 1 0-22 10.9 10.9 0 0 1 7.7 3.1l5.7-5.7A18.9 18.9 0 0 0 24 5a19 19 0 1 0 19.6 15.5z"
            />
            <path
              fill="#FF3D00"
              d="m6.3 14.7 6.6 4.8A11 11 0 0 1 24 13a10.9 10.9 0 0 1 7.7 3.1l5.7-5.7A18.9 18.9 0 0 0 24 5 19 19 0 0 0 6.3 14.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 43a18.9 18.9 0 0 0 13.3-5.2L31 33a11 11 0 0 1-17-5.8l-6.6 5A19 19 0 0 0 24 43z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3a11.5 11.5 0 0 1-3.8 5l6.3 4.8A19.2 19.2 0 0 0 43.6 24a19.6 19.6 0 0 0-.1-3.5z"
            />
          </svg>
          Continue with Google
        </a>

        <p className="mt-6 text-center text-[11px] text-slate-500">
          By continuing you confirm you have been granted superadmin access in
          the <span className="font-mono">profiles</span> table of this
          Supabase project.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
