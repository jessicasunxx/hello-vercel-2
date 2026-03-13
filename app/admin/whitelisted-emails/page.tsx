import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createWhitelistedEmail,
  updateWhitelistedEmail,
  deleteWhitelistedEmail,
} from "./actions";

export const dynamic = "force-dynamic";

type EmailRow = { id: string; email: string | null };

export default async function WhitelistedEmailsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: emails, error } = await supabase
    .from("whitelisted_emails")
    .select("id, email")
    .order("email");

  const rows = (emails as EmailRow[] | null) ?? [];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">
            Whitelisted Emails
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Manage whitelisted e-mail addresses
          </h2>
        </div>
        <Link
          href="/admin"
          className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
        >
          Dashboard
        </Link>
      </header>

      {error && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200/80">
          {error.message}
        </div>
      )}

      <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white">Add whitelisted email</h3>
        <form action={createWhitelistedEmail} className="mt-4 flex flex-wrap gap-4">
          <input
            name="email"
            type="email"
            placeholder="user@example.com"
            required
            className="rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-white placeholder-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
          <button
            type="submit"
            className="rounded-xl bg-cyan-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 transition hover:bg-cyan-500/30"
          >
            Add
          </button>
        </form>
      </section>

      <section className="space-y-4">
        {rows.map((e) => (
          <details
            key={e.id}
            className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 shadow-lg"
          >
            <summary className="cursor-pointer font-semibold text-white">
              {e.email ?? e.id}
            </summary>
            <div className="mt-4 flex flex-wrap gap-4">
              <form action={updateWhitelistedEmail} className="flex flex-wrap gap-3">
                <input type="hidden" name="id" value={e.id} />
                <input
                  name="email"
                  type="email"
                  defaultValue={e.email ?? ""}
                  placeholder="email"
                  required
                  className="rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                />
                <button
                  type="submit"
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 hover:bg-white/5"
                >
                  Save
                </button>
              </form>
              <form action={deleteWhitelistedEmail}>
                <input type="hidden" name="id" value={e.id} />
                <button
                  type="submit"
                  className="rounded-xl border border-red-500/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-400 hover:bg-red-500/10"
                >
                  Delete
                </button>
              </form>
            </div>
          </details>
        ))}
        {rows.length === 0 && !error && (
          <p className="text-sm text-zinc-500">No whitelisted emails yet.</p>
        )}
      </section>
    </div>
  );
}
