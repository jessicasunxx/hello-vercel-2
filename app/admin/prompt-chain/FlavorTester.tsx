"use client";

import { useState } from "react";

export type TestExample = {
  id: string;
  content: string | null;
  imageUrl: string | null;
};

type FlavorTesterProps = {
  humorFlavorId: string;
  examples: TestExample[];
};

type RunResult = {
  exampleId: string;
  label: string;
  ok: boolean;
  status?: number;
  body?: unknown;
  error?: string;
};

export default function FlavorTester({
  humorFlavorId,
  examples,
}: FlavorTesterProps) {
  const withImages = examples.filter((e) => e.imageUrl);
  const [selectedId, setSelectedId] = useState(withImages[0]?.id ?? "");
  const [loading, setLoading] = useState<"one" | "all" | null>(null);
  const [lastSingle, setLastSingle] = useState<RunResult | null>(null);
  const [batch, setBatch] = useState<RunResult[] | null>(null);

  async function runOne(imageUrl: string, exampleId: string, label: string) {
    const res = await fetch("/api/admin/prompt-chain/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl, humorFlavorId }),
    });
    const data = (await res.json()) as {
      ok?: boolean;
      status?: number;
      body?: unknown;
      error?: string;
    };
    if (!res.ok || !data.ok) {
      return {
        exampleId,
        label,
        ok: false,
        error: data.error ?? `HTTP ${res.status}`,
      } satisfies RunResult;
    }
    return {
      exampleId,
      label,
      ok: true,
      status: data.status,
      body: data.body,
    } satisfies RunResult;
  }

  async function handleTestOne() {
    const ex = withImages.find((e) => e.id === selectedId);
    if (!ex?.imageUrl) return;
    setLoading("one");
    setLastSingle(null);
    setBatch(null);
    const label = ex.content?.slice(0, 80) ?? ex.id;
    const result = await runOne(ex.imageUrl, ex.id, label);
    setLastSingle(result);
    setLoading(null);
  }

  async function handleTestAll() {
    setLoading("all");
    setLastSingle(null);
    setBatch(null);
    const out: RunResult[] = [];
    for (const ex of withImages) {
      if (!ex.imageUrl) continue;
      const label = ex.content?.slice(0, 80) ?? ex.id;
      const result = await runOne(ex.imageUrl, ex.id, label);
      out.push(result);
    }
    setBatch(out);
    setLoading(null);
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-white">
        Test with REST API (Assignment 5)
      </h3>
      <p className="mt-2 text-sm text-zinc-400">
        Uses caption examples that include an image URL. Set{" "}
        <span className="font-mono text-xs text-cyan-400/90">
          ALMOSTCRACKD_GENERATE_CAPTIONS_URL
        </span>{" "}
        in Vercel to your full{" "}
        <span className="font-mono text-xs">api.almostcrackd.ai</span> endpoint.
        Optionally set{" "}
        <span className="font-mono text-xs text-cyan-400/90">
          ALMOSTCRACKD_FORWARD_SUPABASE_TOKEN=1
        </span>{" "}
        to pass the current session JWT.
      </p>

      {withImages.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">
          No caption examples with linked images. Add rows in Caption examples
          with an image ID so URLs resolve.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-zinc-400">Example image</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="mt-1 block w-full max-w-xl rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            >
              {withImages.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {(ex.content ?? ex.id).slice(0, 72)}
                  {(ex.content?.length ?? 0) > 72 ? "…" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void handleTestOne()}
              disabled={loading !== null || !selectedId}
              className="rounded-xl bg-cyan-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 transition hover:bg-cyan-500/30 disabled:opacity-40"
            >
              {loading === "one" ? "Generating…" : "Generate once"}
            </button>
            <button
              type="button"
              onClick={() => void handleTestAll()}
              disabled={loading !== null}
              className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white disabled:opacity-40"
            >
              {loading === "all" ? "Running test set…" : "Run full test set"}
            </button>
          </div>
        </div>
      )}

      {lastSingle && (
        <div className="mt-6 rounded-xl border border-white/10 bg-zinc-950/40 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Last response
          </p>
          <p className="mt-2 text-sm text-zinc-300">{lastSingle.label}</p>
          {lastSingle.ok ? (
            <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-words font-mono text-xs text-zinc-400">
              {JSON.stringify(
                { status: lastSingle.status, body: lastSingle.body },
                null,
                2
              )}
            </pre>
          ) : (
            <p className="mt-2 text-sm text-red-400">{lastSingle.error}</p>
          )}
        </div>
      )}

      {batch && batch.length > 0 && (
        <div className="mt-6 space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Test set results
          </p>
          {batch.map((r) => (
            <details
              key={r.exampleId}
              className="rounded-xl border border-white/10 bg-zinc-950/40 p-3"
            >
              <summary className="cursor-pointer text-sm text-zinc-300">
                {r.ok ? "✓" : "✗"} {r.label}
              </summary>
              {r.ok ? (
                <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-words font-mono text-xs text-zinc-500">
                  {JSON.stringify(
                    { status: r.status, body: r.body },
                    null,
                    2
                  )}
                </pre>
              ) : (
                <p className="mt-2 text-sm text-red-400">{r.error}</p>
              )}
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
