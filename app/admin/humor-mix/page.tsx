import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateHumorMix } from "./actions";
import HumorMixRow from "./HumorMixRow";

export const dynamic = "force-dynamic";

export default async function HumorMixPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("humor_mix")
    .select("*")
    .order("id");

  const rows = (data ?? []) as Record<string, unknown>[];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">
            Humor Mix
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Read / update humor mix
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

      <section className="space-y-4">
        {rows.map((row, i) => (
          <HumorMixRow
            key={safeKey(row)}
            row={row}
            updateHumorMix={updateHumorMix}
          />
        ))}
        {rows.length === 0 && !error && (
          <p className="text-sm text-zinc-500">No humor mix rows yet.</p>
        )}
      </section>
    </div>
  );
}

function safeKey(row: Record<string, unknown>): string {
  const id = row.id;
  if (id != null && typeof id === "string") return id;
  return String(JSON.stringify(row));
}
