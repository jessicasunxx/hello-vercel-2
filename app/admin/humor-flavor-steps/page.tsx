import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import GenericDataTable from "../GenericDataTable";

export const dynamic = "force-dynamic";

export default async function HumorFlavorStepsPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("humor_flavor_steps")
    .select("*")
    .order("id");

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">
            Humor Flavor Steps
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Read humor flavor steps
          </h2>
        </div>
        <Link
          href="/admin"
          className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
        >
          Dashboard
        </Link>
      </header>
      <GenericDataTable
        title="humor_flavor_steps"
        data={data}
        error={error?.message ?? null}
      />
    </div>
  );
}
