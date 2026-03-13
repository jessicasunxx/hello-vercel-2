import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createCaptionExample, updateCaptionExample, deleteCaptionExample } from "./actions";

export const dynamic = "force-dynamic";

type ExampleRow = { id: string; content: string | null; image_id: string | null };

export default async function CaptionExamplesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: examples, error } = await supabase
    .from("caption_examples")
    .select("id, content, image_id")
    .order("id", { ascending: false });

  const rows = (examples as ExampleRow[] | null) ?? [];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">
            Caption Examples
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Manage caption examples
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
        <h3 className="text-lg font-semibold text-white">Add caption example</h3>
        <form action={createCaptionExample} className="mt-4 space-y-4">
          <div>
            <label className="text-sm text-zinc-400">Content</label>
            <textarea
              name="content"
              required
              rows={2}
              placeholder="Example caption text"
              className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-white placeholder-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>
          <div>
            <label className="text-sm text-zinc-400">Image ID (optional)</label>
            <input
              name="image_id"
              placeholder="UUID"
              className="mt-1 w-full max-w-md rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-white placeholder-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-cyan-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 transition hover:bg-cyan-500/30"
          >
            Create
          </button>
        </form>
      </section>

      <section className="space-y-4">
        {rows.map((ex) => (
          <details
            key={ex.id}
            className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 shadow-lg"
          >
            <summary className="max-w-xl cursor-pointer truncate font-medium text-white">
              {ex.content ?? ex.id}
            </summary>
            <div className="mt-4 flex flex-wrap gap-4">
              <form action={updateCaptionExample} className="flex flex-1 flex-wrap gap-3">
                <input type="hidden" name="id" value={ex.id} />
                <div className="w-full">
                  <textarea
                    name="content"
                    defaultValue={ex.content ?? ""}
                    rows={2}
                    required
                    className="w-full rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                  />
                </div>
                <input
                  name="image_id"
                  defaultValue={ex.image_id ?? ""}
                  placeholder="Image ID"
                  className="rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                />
                <button
                  type="submit"
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 hover:bg-white/5"
                >
                  Save
                </button>
              </form>
              <form action={deleteCaptionExample}>
                <input type="hidden" name="id" value={ex.id} />
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
          <p className="text-sm text-zinc-500">No caption examples yet.</p>
        )}
      </section>
    </div>
  );
}
