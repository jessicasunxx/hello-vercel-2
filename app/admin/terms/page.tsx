import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createTerm, updateTerm, deleteTerm } from "./actions";

export const dynamic = "force-dynamic";

type TermRow = { id: string; term: string | null; definition: string | null };

export default async function TermsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: terms, error } = await supabase
    .from("terms")
    .select("id, term, definition")
    .order("term");

  const rows = (terms as TermRow[] | null) ?? [];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">Terms</p>
          <h2 className="text-3xl font-semibold text-white">Manage terms</h2>
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
        <h3 className="text-lg font-semibold text-white">Add term</h3>
        <form action={createTerm} className="mt-4 flex flex-wrap gap-4">
          <input
            name="term"
            placeholder="Term"
            required
            className="rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-white placeholder-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
          <input
            name="definition"
            placeholder="Definition (optional)"
            className="min-w-[200px] flex-1 rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-white placeholder-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
          <button
            type="submit"
            className="rounded-xl bg-cyan-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 transition hover:bg-cyan-500/30"
          >
            Create
          </button>
        </form>
      </section>

      <section className="space-y-4">
        {rows.map((t) => (
          <details
            key={t.id}
            className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 shadow-lg"
          >
            <summary className="cursor-pointer font-semibold text-white">
              {t.term ?? t.id}
            </summary>
            <div className="mt-4 flex flex-wrap gap-4">
              <form action={updateTerm} className="flex flex-1 flex-wrap gap-3">
                <input type="hidden" name="id" value={t.id} />
                <input
                  name="term"
                  defaultValue={t.term ?? ""}
                  placeholder="Term"
                  required
                  className="rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                />
                <input
                  name="definition"
                  defaultValue={t.definition ?? ""}
                  placeholder="Definition"
                  className="min-w-[200px] flex-1 rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                />
                <button
                  type="submit"
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 hover:bg-white/5"
                >
                  Save
                </button>
              </form>
              <form action={deleteTerm}>
                <input type="hidden" name="id" value={t.id} />
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
          <p className="text-sm text-zinc-500">No terms yet.</p>
        )}
      </section>
    </div>
  );
}
