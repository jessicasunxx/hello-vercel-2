import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getCounts() {
  const supabase = await createSupabaseServerClient();

  const [
    profilesResult,
    imagesResult,
    captionsResult,
    publicImagesResult,
    recentProfilesResult,
    reportsResult,
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("images").select("*", { count: "exact", head: true }),
    supabase.from("captions").select("*", { count: "exact", head: true }),
    supabase
      .from("images")
      .select("*", { count: "exact", head: true })
      .eq("is_public", true),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte(
        "created_datetime_utc",
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      ),
    supabase.from("reported_captions").select("*", { count: "exact", head: true }),
  ]);

  return {
    profiles: profilesResult.count ?? 0,
    images: imagesResult.count ?? 0,
    captions: captionsResult.count ?? 0,
    publicImages: publicImagesResult.count ?? 0,
    recentProfiles: recentProfilesResult.count ?? 0,
    reports: reportsResult.count ?? 0,
  };
}

async function getHighlights() {
  const supabase = await createSupabaseServerClient();

  const [recentImages, recentCaptions] = await Promise.all([
    supabase
      .from("images")
      .select("id, url, created_datetime_utc, is_public")
      .order("created_datetime_utc", { ascending: false })
      .limit(5),
    supabase
      .from("captions")
      .select("id, content, created_datetime_utc, is_public, like_count")
      .order("created_datetime_utc", { ascending: false })
      .limit(5),
  ]);

  return {
    recentImages: recentImages.data ?? [],
    recentCaptions: recentCaptions.data ?? [],
  };
}

function formatImageLabel(url: string | null) {
  if (!url) {
    return "Untitled image";
  }

  try {
    const parsed = new URL(url);
    return `${parsed.hostname}${parsed.pathname}`;
  } catch {
    return url;
  }
}

export default async function AdminHomePage() {
  const [counts, highlights] = await Promise.all([getCounts(), getHighlights()]);
  const publicRatio =
    counts.images === 0
      ? "0%"
      : `${Math.round((counts.publicImages / counts.images) * 100)}%`;

  return (
    <div className="space-y-12">
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-8 shadow-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">
            Dashboard
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">
            Overview
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-400">
            View stats at a glance. Manage profiles, images, and captions from the quick links below.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Profiles", value: counts.profiles },
              { label: "Images", value: counts.images },
              { label: "Captions", value: counts.captions },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-zinc-800/50 p-4"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                  {stat.label}
                </p>
                <p className="mt-1 text-2xl font-semibold text-white">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-6 shadow-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-400/80">
            Quick Links
          </p>
          <div className="mt-6 space-y-3">
            {[
              { href: "/admin/profiles", label: "Review profiles" },
              { href: "/admin/images", label: "Manage images" },
              { href: "/admin/captions", label: "Audit captions" },
              { href: "/admin/caption-requests", label: "Caption requests" },
              { href: "/admin/caption-examples", label: "Caption examples" },
              { href: "/admin/prompt-chain", label: "Prompt chain (flavors)" },
              { href: "/admin/humor-flavors", label: "Humor flavors (table)" },
              { href: "/admin/humor-flavor-steps", label: "Humor flavor steps (table)" },
              { href: "/admin/humor-mix", label: "Humor mix" },
              { href: "/admin/terms", label: "Terms" },
              { href: "/admin/llm-models", label: "LLM models" },
              { href: "/admin/llm-providers", label: "LLM providers" },
              { href: "/admin/llm-prompt-chains", label: "LLM prompt chains" },
              { href: "/admin/llm-responses", label: "LLM responses" },
              { href: "/admin/allowed-domains", label: "Allowed signup domains" },
              {
                href: "/admin/whitelisted-emails",
                label: "Whitelisted emails",
              },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm uppercase tracking-[0.2em] text-zinc-400 transition hover:border-cyan-500/30 hover:bg-cyan-500/5 hover:text-cyan-400"
              >
                {link.label}
                <span aria-hidden className="text-cyan-400/60">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          {
            label: "Profiles (7d)",
            value: counts.recentProfiles,
            note: "New signups this week",
          },
          {
            label: "Reports filed",
            value: counts.reports,
            note: "Pending moderation attention",
          },
          {
            label: "Public share rate",
            value: publicRatio,
            note: "Images currently visible",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-lg"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              {stat.label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-zinc-500">{stat.note}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white">
            Recent image uploads
          </h3>
          <div className="mt-4 space-y-3">
            {highlights.recentImages.length === 0 ? (
              <p className="text-sm text-zinc-500">No images yet.</p>
            ) : (
              highlights.recentImages.map((image) => (
                <div
                  key={image.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-800/50 p-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">
                      <span className="block max-w-[320px] truncate">
                        {formatImageLabel(image.url)}
                      </span>
                    </p>
                    <p className="text-xs text-zinc-500">
                      {image.created_datetime_utc}
                    </p>
                  </div>
                  <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                    {image.is_public ? "Public" : "Private"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white">
            Latest captions
          </h3>
          <div className="mt-4 space-y-3">
            {highlights.recentCaptions.length === 0 ? (
              <p className="text-sm text-zinc-500">No captions yet.</p>
            ) : (
              highlights.recentCaptions.map((caption) => (
                <div
                  key={caption.id}
                  className="rounded-xl border border-white/10 bg-zinc-800/50 p-3"
                >
                  <p className="text-sm font-semibold text-white">
                    {caption.content || "Untitled caption"}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
                    <span>{caption.created_datetime_utc}</span>
                    <span>{caption.like_count ?? 0} likes</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
