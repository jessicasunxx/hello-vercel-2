import { createSupabaseServerClient } from "@/lib/supabase/server";
import CaptionStatsCharts from "./CaptionStatsCharts";

export const dynamic = "force-dynamic";

type CaptionRow = {
  id: string;
  content: string | null;
  created_datetime_utc: string | null;
  is_public: boolean | null;
  is_featured: boolean | null;
  like_count: number | null;
  profile_id: string | null;
};

async function fetchAllCaptions(): Promise<CaptionRow[]> {
  const supabase = await createSupabaseServerClient();
  const PAGE_SIZE = 1000;
  const rows: CaptionRow[] = [];
  let from = 0;

  while (true) {
    const { data } = await supabase
      .from("captions")
      .select(
        "id, content, created_datetime_utc, is_public, is_featured, like_count, profile_id"
      )
      .not("content", "is", null)
      .neq("content", "")
      .order("created_datetime_utc", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (!data || data.length === 0) break;
    rows.push(...(data as CaptionRow[]));
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return rows;
}

function buildLikeBuckets(captions: CaptionRow[]) {
  const buckets = [
    { range: "0", min: 0, max: 0, count: 0 },
    { range: "1–5", min: 1, max: 5, count: 0 },
    { range: "6–10", min: 6, max: 10, count: 0 },
    { range: "11–25", min: 11, max: 25, count: 0 },
    { range: "26–50", min: 26, max: 50, count: 0 },
    { range: "51–100", min: 51, max: 100, count: 0 },
    { range: "101+", min: 101, max: Infinity, count: 0 },
  ];

  for (const c of captions) {
    const likes = c.like_count ?? 0;
    const bucket = buckets.find((b) => likes >= b.min && likes <= b.max);
    if (bucket) bucket.count++;
  }

  return buckets.map(({ range, count }) => ({ range, count }));
}

function buildDailyVolume(captions: CaptionRow[]) {
  const dailyMap = new Map<string, { captions: number; likes: number }>();

  for (const c of captions) {
    const date = c.created_datetime_utc?.slice(0, 10);
    if (!date) continue;
    const entry = dailyMap.get(date) ?? { captions: 0, likes: 0 };
    entry.captions++;
    entry.likes += c.like_count ?? 0;
    dailyMap.set(date, entry);
  }

  return Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, stats]) => ({ date, ...stats }));
}

function buildVisibilityBreakdown(captions: CaptionRow[]) {
  let pub = 0;
  let priv = 0;
  for (const c of captions) {
    if (c.is_public) pub++;
    else priv++;
  }
  return [
    { name: "Public", value: pub },
    { name: "Private", value: priv },
  ];
}

function buildFeaturedBreakdown(captions: CaptionRow[]) {
  let featured = 0;
  let regular = 0;
  for (const c of captions) {
    if (c.is_featured) featured++;
    else regular++;
  }
  return [
    { name: "Featured", value: featured },
    { name: "Regular", value: regular },
  ];
}

function buildTopCaptions(captions: CaptionRow[], limit = 10) {
  return [...captions]
    .sort((a, b) => (b.like_count ?? 0) - (a.like_count ?? 0))
    .slice(0, limit)
    .map((c) => ({
      id: c.id,
      content: c.content ?? "",
      like_count: c.like_count ?? 0,
      created_datetime_utc: c.created_datetime_utc,
      is_public: c.is_public,
      is_featured: c.is_featured,
    }));
}

function buildTopContributors(captions: CaptionRow[], limit = 10) {
  const map = new Map<string, { caption_count: number; total_likes: number }>();

  for (const c of captions) {
    const pid = c.profile_id ?? "unknown";
    const entry = map.get(pid) ?? { caption_count: 0, total_likes: 0 };
    entry.caption_count++;
    entry.total_likes += c.like_count ?? 0;
    map.set(pid, entry);
  }

  return Array.from(map.entries())
    .map(([profile_id, stats]) => ({ profile_id, ...stats }))
    .sort((a, b) => b.total_likes - a.total_likes)
    .slice(0, limit);
}

function buildSummary(captions: CaptionRow[]) {
  const likes = captions.map((c) => c.like_count ?? 0);
  const totalLikes = likes.reduce((sum, l) => sum + l, 0);
  const sorted = [...likes].sort((a, b) => a - b);
  const median =
    sorted.length === 0
      ? 0
      : sorted.length % 2 === 1
        ? sorted[Math.floor(sorted.length / 2)]
        : Math.round(
            (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
          );

  const withLikes = likes.filter((l) => l > 0).length;

  return {
    totalCaptions: captions.length,
    totalLikes,
    avgLikes: captions.length > 0 ? totalLikes / captions.length : 0,
    medianLikes: median,
    maxLikes: sorted.length > 0 ? sorted[sorted.length - 1] : 0,
    captionsWithLikes: withLikes,
    captionsWithLikesPercent:
      captions.length > 0 ? Math.round((withLikes / captions.length) * 100) : 0,
    featuredCount: captions.filter((c) => c.is_featured).length,
    publicCount: captions.filter((c) => c.is_public).length,
  };
}

export default async function CaptionStatsPage() {
  const captions = await fetchAllCaptions();

  const likeBuckets = buildLikeBuckets(captions);
  const dailyVolume = buildDailyVolume(captions);
  const visibilityBreakdown = buildVisibilityBreakdown(captions);
  const featuredBreakdown = buildFeaturedBreakdown(captions);
  const topCaptions = buildTopCaptions(captions);
  const topContributors = buildTopContributors(captions);
  const summary = buildSummary(captions);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">
            Analytics
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Caption rating statistics
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Engagement metrics and rating distribution across all captions
          </p>
        </div>
        <a
          href="/admin"
          className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
        >
          Dashboard
        </a>
      </header>

      <CaptionStatsCharts
        likeBuckets={likeBuckets}
        dailyVolume={dailyVolume}
        visibilityBreakdown={visibilityBreakdown}
        featuredBreakdown={featuredBreakdown}
        topCaptions={topCaptions}
        topContributors={topContributors}
        summary={summary}
      />
    </div>
  );
}
