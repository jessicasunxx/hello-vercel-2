"use client";

type HumorMixRowProps = {
  row: Record<string, unknown>;
  updateHumorMix: (formData: FormData) => Promise<void>;
};

const READONLY_KEYS = ["id", "created_at", "created_datetime_utc", "updated_at"];

function safeVal(v: unknown): string {
  if (v == null) return "";
  return String(v);
}

export default function HumorMixRow({ row, updateHumorMix }: HumorMixRowProps) {
  const entries = Object.entries(row).filter(
    ([k]) => !READONLY_KEYS.includes(k)
  );

  return (
    <details className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 shadow-lg">
      <summary className="cursor-pointer font-semibold text-white">
        {safeVal(row.id)}
      </summary>
      <form action={updateHumorMix} className="mt-4 flex flex-wrap gap-4">
        <input type="hidden" name="id" value={safeVal(row.id)} />
        {entries.map(([key, value]) => (
          <label key={key} className="text-sm text-zinc-400">
            {key}
            <input
              name={key}
              defaultValue={safeVal(value)}
              className="mt-1 block rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />
          </label>
        ))}
        <div className="flex w-full items-end">
          <button
            type="submit"
            className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 hover:bg-white/5"
          >
            Save
          </button>
        </div>
      </form>
    </details>
  );
}
