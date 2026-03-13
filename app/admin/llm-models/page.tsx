import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createLLMModel, updateLLMModel, deleteLLMModel } from "./actions";

export const dynamic = "force-dynamic";

type ModelRow = {
  id: string;
  name: string | null;
  provider_id: string | null;
  model_id: string | null;
};

export default async function LLMModelsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: models, error } = await supabase
    .from("llm_models")
    .select("id, name, provider_id, model_id")
    .order("name");

  const rows = (models as ModelRow[] | null) ?? [];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">
            LLM Models
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Manage LLM models
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
        <h3 className="text-lg font-semibold text-white">Add LLM model</h3>
        <form action={createLLMModel} className="mt-4 flex flex-wrap gap-4">
          <input
            name="name"
            placeholder="Model name"
            required
            className="rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-white placeholder-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
          <input
            name="provider_id"
            placeholder="Provider ID (optional)"
            className="rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-white placeholder-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
          <input
            name="model_id"
            placeholder="Model ID / API identifier (optional)"
            className="rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-white placeholder-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
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
        {rows.map((m) => (
          <details
            key={m.id}
            className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 shadow-lg"
          >
            <summary className="cursor-pointer font-semibold text-white">
              {m.name ?? m.id}
            </summary>
            <div className="mt-4 flex flex-wrap gap-4">
              <form action={updateLLMModel} className="flex flex-1 flex-wrap gap-3">
                <input type="hidden" name="id" value={m.id} />
                <input
                  name="name"
                  defaultValue={m.name ?? ""}
                  placeholder="Model name"
                  required
                  className="rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                />
                <input
                  name="provider_id"
                  defaultValue={m.provider_id ?? ""}
                  placeholder="Provider ID"
                  className="rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                />
                <input
                  name="model_id"
                  defaultValue={m.model_id ?? ""}
                  placeholder="Model ID"
                  className="rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                />
                <button
                  type="submit"
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 hover:bg-white/5"
                >
                  Save
                </button>
              </form>
              <form action={deleteLLMModel}>
                <input type="hidden" name="id" value={m.id} />
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
          <p className="text-sm text-zinc-500">No LLM models yet.</p>
        )}
      </section>
    </div>
  );
}
