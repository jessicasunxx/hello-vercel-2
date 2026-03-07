"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="mx-auto max-w-md rounded-xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur">
        <h2 className="mb-4 text-2xl font-bold text-white">Something went wrong!</h2>
        {error.message?.includes("Missing NEXT_PUBLIC_SUPABASE") ? (
          <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-200">
            <p className="font-semibold">Configuration Error</p>
            <p className="mt-2 text-sm">
              Missing Supabase environment variables. Please check your Vercel project settings.
            </p>
          </div>
        ) : (
          <p className="mb-4 text-slate-400">{error.message || "An unexpected error occurred"}</p>
        )}
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 rounded-lg bg-sky-500 px-4 py-2 font-medium text-white transition hover:bg-sky-400"
          >
            Try again
          </button>
          <Link
            href="/login"
            className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-center font-medium text-slate-300 transition hover:bg-slate-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
