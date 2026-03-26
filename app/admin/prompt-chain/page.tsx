import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import FlavorTester from "./FlavorTester";
import {
  createHumorFlavor,
  createHumorFlavorStep,
  deleteHumorFlavor,
  deleteHumorFlavorStep,
  moveHumorFlavorStep,
  updateHumorFlavor,
  updateHumorFlavorStep,
} from "./actions";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ flavor?: string }>;

type FlavorRow = {
  id: string;
  name: string;
  description: string | null;
};

type StepRow = {
  id: string;
  humor_flavor_id: string;
  step_number: number;
  prompt_text: string;
};

type CaptionRow = {
  id: string;
  content: string | null;
  created_datetime_utc: string | null;
  image_id: string | null;
  humor_flavor_id?: string | null;
};

export default async function PromptChainPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const selectedId = params.flavor?.trim() ?? null;

  const supabase = await createSupabaseServerClient();

  const { data: flavors, error: flavorsError } = await supabase
    .from("humor_flavors")
    .select("id, name, description")
    .order("name");

  const flavorRows = (flavors ?? []) as FlavorRow[];

  let steps: StepRow[] = [];
  let stepsError: string | null = null;
  let selectedFlavor: FlavorRow | null =
    flavorRows.find((f) => f.id === selectedId) ?? null;

  if (selectedId) {
    const { data, error } = await supabase
      .from("humor_flavor_steps")
      .select("id, humor_flavor_id, step_number, prompt_text")
      .eq("humor_flavor_id", selectedId)
      .order("step_number", { ascending: true });

    if (error) {
      stepsError = error.message;
    } else {
      steps = (data ?? []) as StepRow[];
    }

    if (!selectedFlavor) {
      const { data: one } = await supabase
        .from("humor_flavors")
        .select("id, name, description")
        .eq("id", selectedId)
        .maybeSingle();
      if (one) {
        selectedFlavor = one as FlavorRow;
      }
    }
  }

  let captionRows: CaptionRow[] = [];
  let captionsError: string | null = null;
  if (selectedId) {
    const { data, error } = await supabase
      .from("captions")
      .select("id, content, created_datetime_utc, image_id, humor_flavor_id")
      .eq("humor_flavor_id", selectedId)
      .order("created_datetime_utc", { ascending: false })
      .limit(80);

    if (error) {
      captionsError = error.message;
    } else {
      captionRows = (data ?? []) as CaptionRow[];
    }
  }

  const { data: exData, error: exError } = await supabase
    .from("caption_examples")
    .select("id, content, image_id, image:images(url)")
    .order("id", { ascending: false });

  type ExRow = {
    id: string;
    content: string | null;
    image_id: string | null;
    image?: { url: string | null } | { url: string | null }[] | null;
  };

  const testExamples =
    (exData as ExRow[] | null)?.map((r) => {
      const url = Array.isArray(r.image)
        ? r.image[0]?.url
        : r.image?.url;
      return {
        id: r.id,
        content: r.content,
        imageUrl: url ?? null,
      };
    }) ?? [];

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">
            Prompt chain
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Humor flavors &amp; steps
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Define ordered prompt steps per flavor, then test caption generation
            against the Assignment 5 API. Tables expect{" "}
            <span className="font-mono text-xs text-zinc-300">
              humor_flavors(name, description)
            </span>{" "}
            and{" "}
            <span className="font-mono text-xs text-zinc-300">
              humor_flavor_steps(humor_flavor_id, step_number, prompt_text)
            </span>
            , plus{" "}
            <span className="font-mono text-xs text-zinc-300">
              captions.humor_flavor_id
            </span>{" "}
            to filter stored captions.
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
        >
          Dashboard
        </Link>
      </header>

      {flavorsError && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200/80">
          {flavorsError.message}
        </div>
      )}

      {exError && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200/80">
          Caption examples: {exError.message}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,280px)_1fr]">
        <aside className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 shadow-lg">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
              New flavor
            </h3>
            <form action={createHumorFlavor} className="mt-4 space-y-3">
              <input
                name="name"
                required
                placeholder="Name"
                className="w-full rounded-xl border border-white/10 bg-zinc-800/80 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
              <textarea
                name="description"
                rows={2}
                placeholder="Description (optional)"
                className="w-full rounded-xl border border-white/10 bg-zinc-800/80 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-cyan-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 transition hover:bg-cyan-500/30"
              >
                Create flavor
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-5 shadow-lg">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
              All flavors
            </h3>
            <ul className="mt-4 space-y-2">
              {flavorRows.map((f) => (
                <li key={f.id}>
                  <Link
                    href={`/admin/prompt-chain?flavor=${f.id}`}
                    className={
                      f.id === selectedId
                        ? "block rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100"
                        : "block rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:border-white/20 hover:bg-white/5"
                    }
                  >
                    {f.name}
                  </Link>
                </li>
              ))}
            </ul>
            {flavorRows.length === 0 && !flavorsError && (
              <p className="mt-3 text-sm text-zinc-500">No flavors yet.</p>
            )}
          </section>
        </aside>

        <main className="min-w-0 space-y-8">
          {!selectedId && (
            <p className="rounded-2xl border border-dashed border-white/15 bg-zinc-900/40 p-8 text-center text-sm text-zinc-500">
              Select a flavor or create one to edit steps and run API tests.
            </p>
          )}

          {selectedId && selectedFlavor && (
            <>
              <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-lg">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold text-white">
                    {selectedFlavor.name}
                  </h3>
                  <form action={deleteHumorFlavor}>
                    <input type="hidden" name="id" value={selectedFlavor.id} />
                    <button
                      type="submit"
                      className="rounded-xl border border-red-500/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-red-400 transition hover:bg-red-500/10"
                    >
                      Delete flavor
                    </button>
                  </form>
                </div>
                <form action={updateHumorFlavor} className="mt-4 space-y-3">
                  <input type="hidden" name="id" value={selectedFlavor.id} />
                  <div>
                    <label className="text-sm text-zinc-400">Name</label>
                    <input
                      name="name"
                      required
                      defaultValue={selectedFlavor.name}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-zinc-400">Description</label>
                    <textarea
                      name="description"
                      rows={2}
                      defaultValue={selectedFlavor.description ?? ""}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                  >
                    Save flavor
                  </button>
                </form>
              </section>

              <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-white">
                  Steps (ordered chain)
                </h3>
                {stepsError && (
                  <p className="mt-2 text-sm text-amber-200/80">{stepsError}</p>
                )}
                <div className="mt-4 space-y-4">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="rounded-xl border border-white/10 bg-zinc-950/40 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                          Step {step.step_number}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <form action={moveHumorFlavorStep}>
                            <input
                              type="hidden"
                              name="humor_flavor_id"
                              value={selectedFlavor.id}
                            />
                            <input type="hidden" name="step_id" value={step.id} />
                            <input type="hidden" name="direction" value="up" />
                            <button
                              type="submit"
                              disabled={index === 0}
                              className="rounded-lg border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400 hover:bg-white/5 disabled:opacity-30"
                            >
                              Up
                            </button>
                          </form>
                          <form action={moveHumorFlavorStep}>
                            <input
                              type="hidden"
                              name="humor_flavor_id"
                              value={selectedFlavor.id}
                            />
                            <input type="hidden" name="step_id" value={step.id} />
                            <input type="hidden" name="direction" value="down" />
                            <button
                              type="submit"
                              disabled={index === steps.length - 1}
                              className="rounded-lg border border-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400 hover:bg-white/5 disabled:opacity-30"
                            >
                              Down
                            </button>
                          </form>
                          <form action={deleteHumorFlavorStep}>
                            <input
                              type="hidden"
                              name="humor_flavor_id"
                              value={selectedFlavor.id}
                            />
                            <input type="hidden" name="id" value={step.id} />
                            <button
                              type="submit"
                              className="rounded-lg border border-red-500/25 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-red-400 hover:bg-red-500/10"
                            >
                              Delete
                            </button>
                          </form>
                        </div>
                      </div>
                      <form
                        action={updateHumorFlavorStep}
                        className="mt-3 space-y-2"
                      >
                        <input type="hidden" name="id" value={step.id} />
                        <input
                          type="hidden"
                          name="humor_flavor_id"
                          value={selectedFlavor.id}
                        />
                        <textarea
                          name="prompt_text"
                          required
                          rows={4}
                          defaultValue={step.prompt_text}
                          className="w-full rounded-xl border border-white/10 bg-zinc-800/80 px-3 py-2 font-mono text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                        />
                        <button
                          type="submit"
                          className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 hover:bg-white/5"
                        >
                          Save step
                        </button>
                      </form>
                    </div>
                  ))}
                </div>

                <form
                  action={createHumorFlavorStep}
                  className="mt-6 space-y-3 border-t border-white/10 pt-6"
                >
                  <input
                    type="hidden"
                    name="humor_flavor_id"
                    value={selectedFlavor.id}
                  />
                  <h4 className="text-sm font-semibold text-zinc-300">
                    Add step
                  </h4>
                  <textarea
                    name="prompt_text"
                    required
                    rows={3}
                    placeholder="Instruction for this chain step (e.g. describe the image, then joke about it, then list captions)…"
                    className="w-full rounded-xl border border-white/10 bg-zinc-800/80 px-3 py-2 font-mono text-sm text-white placeholder-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-cyan-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 transition hover:bg-cyan-500/30"
                  >
                    Append step
                  </button>
                </form>
              </section>

              <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-white">
                  Captions for this flavor
                </h3>
                {captionsError ? (
                  <p className="mt-2 text-sm text-amber-200/80">
                    {captionsError}
                  </p>
                ) : captionRows.length === 0 ? (
                  <p className="mt-3 text-sm text-zinc-500">
                    No captions linked to this flavor yet.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {captionRows.map((c) => (
                      <li
                        key={c.id}
                        className="rounded-xl border border-white/10 bg-zinc-950/40 p-4"
                      >
                        <p className="text-sm text-white">
                          {c.content ?? "(empty)"}
                        </p>
                        <p className="mt-2 text-xs text-zinc-500">
                          {c.created_datetime_utc ?? "—"} · image{" "}
                          {c.image_id ?? "—"}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {selectedId && (
                <FlavorTester
                  humorFlavorId={selectedId}
                  examples={testExamples}
                />
              )}
            </>
          )}

          {selectedId && !selectedFlavor && (
            <p className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 text-sm text-amber-100">
              That flavor was not found.{" "}
              <Link href="/admin/prompt-chain" className="text-cyan-400 underline">
                Clear selection
              </Link>
              .
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
