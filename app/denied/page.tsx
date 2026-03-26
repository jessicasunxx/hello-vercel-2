export default function DeniedPage() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">
          Access Restricted
        </p>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">
          You do not have permission to access this admin area.
        </h1>
        <p className="max-w-xl text-base leading-7 text-zinc-400">
          Superadmin or matrix admin access is required. If you believe you
          should have access, ask an existing superadmin to grant it in
          Supabase or update your profile.
        </p>
        <a
          href="/login"
          className="rounded-xl border border-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 transition hover:border-white/20 hover:bg-white/5 hover:text-zinc-300"
        >
          Back to login
        </a>
      </main>
    </div>
  );
}
