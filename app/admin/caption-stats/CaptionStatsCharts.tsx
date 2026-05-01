"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  type PieLabelRenderProps,
} from "recharts";

type LikeBucket = { range: string; count: number };
type DailyVolume = { date: string; captions: number; likes: number };
type TopCaption = {
  id: string;
  content: string;
  like_count: number;
  created_datetime_utc: string | null;
  is_public: boolean | null;
  is_featured: boolean | null;
};
type TopContributor = { profile_id: string; caption_count: number; total_likes: number };

type Props = {
  likeBuckets: LikeBucket[];
  dailyVolume: DailyVolume[];
  visibilityBreakdown: { name: string; value: number }[];
  featuredBreakdown: { name: string; value: number }[];
  topCaptions: TopCaption[];
  topContributors: TopContributor[];
  summary: {
    totalCaptions: number;
    totalLikes: number;
    avgLikes: number;
    medianLikes: number;
    maxLikes: number;
    captionsWithLikes: number;
    captionsWithLikesPercent: number;
    featuredCount: number;
    publicCount: number;
  };
};

const PIE_COLORS = ["#06b6d4", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#10b981"];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 font-semibold text-zinc-300">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export default function CaptionStatsCharts({
  likeBuckets,
  dailyVolume,
  visibilityBreakdown,
  featuredBreakdown,
  topCaptions,
  topContributors,
  summary,
}: Props) {
  return (
    <div className="space-y-10">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total captions", value: summary.totalCaptions.toLocaleString() },
          { label: "Total likes", value: summary.totalLikes.toLocaleString() },
          { label: "Avg likes / caption", value: summary.avgLikes.toFixed(1) },
          { label: "Median likes", value: summary.medianLikes.toLocaleString() },
          { label: "Max likes", value: summary.maxLikes.toLocaleString() },
          {
            label: "Captions with likes",
            value: `${summary.captionsWithLikes} (${summary.captionsWithLikesPercent}%)`,
          },
          { label: "Featured", value: summary.featuredCount.toLocaleString() },
          { label: "Public", value: summary.publicCount.toLocaleString() },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/10 bg-zinc-800/50 p-4"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              {stat.label}
            </p>
            <p className="mt-1 text-xl font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Like distribution chart */}
      <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-lg">
        <h3 className="mb-1 text-lg font-semibold text-white">
          Like count distribution
        </h3>
        <p className="mb-6 text-xs text-zinc-500">
          How many captions fall into each like-count range
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={likeBuckets} margin={{ top: 4, right: 12, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="range" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
              <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Captions" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Captions & likes over time */}
      <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-lg">
        <h3 className="mb-1 text-lg font-semibold text-white">
          Captions &amp; likes over time
        </h3>
        <p className="mb-6 text-xs text-zinc-500">
          Daily volume of new captions and cumulative likes received
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyVolume} margin={{ top: 4, right: 12, bottom: 4, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 11, color: "#a1a1aa" }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="captions"
                name="New captions"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="likes"
                name="Likes received"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Pie charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-lg">
          <h3 className="mb-1 text-lg font-semibold text-white">Visibility</h3>
          <p className="mb-6 text-xs text-zinc-500">Public vs private captions</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={visibilityBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(props: PieLabelRenderProps) =>
                    `${props.name ?? ""} ${((props.percent ?? 0) * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {visibilityBreakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-lg">
          <h3 className="mb-1 text-lg font-semibold text-white">Featured status</h3>
          <p className="mb-6 text-xs text-zinc-500">Featured vs regular captions</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={featuredBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(props: PieLabelRenderProps) =>
                    `${props.name ?? ""} ${((props.percent ?? 0) * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {featuredBreakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Top captions table */}
      <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-lg">
        <h3 className="mb-1 text-lg font-semibold text-white">
          Top rated captions
        </h3>
        <p className="mb-6 text-xs text-zinc-500">
          Captions with the most likes
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                <th className="pb-3 pr-4 font-medium">Rank</th>
                <th className="pb-3 pr-4 font-medium">Caption</th>
                <th className="pb-3 pr-4 font-medium">Likes</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {topCaptions.map((c, i) => (
                <tr
                  key={c.id}
                  className="border-b border-white/5 text-zinc-300"
                >
                  <td className="py-3 pr-4 text-zinc-500">{i + 1}</td>
                  <td className="max-w-sm truncate py-3 pr-4 font-medium text-white">
                    {c.content}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-cyan-400">
                    {c.like_count}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="inline-flex gap-1.5">
                      {c.is_public && (
                        <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">
                          Public
                        </span>
                      )}
                      {c.is_featured && (
                        <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-cyan-400">
                          Featured
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-zinc-500">
                    {c.created_datetime_utc?.slice(0, 10) ?? "—"}
                  </td>
                </tr>
              ))}
              {topCaptions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-zinc-500">
                    No captions with likes yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Top contributors table */}
      <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-lg">
        <h3 className="mb-1 text-lg font-semibold text-white">
          Most active contributors
        </h3>
        <p className="mb-6 text-xs text-zinc-500">
          Profiles with the most captions and total likes received
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                <th className="pb-3 pr-4 font-medium">Rank</th>
                <th className="pb-3 pr-4 font-medium">Profile ID</th>
                <th className="pb-3 pr-4 font-medium">Captions</th>
                <th className="pb-3 font-medium">Total likes</th>
              </tr>
            </thead>
            <tbody>
              {topContributors.map((c, i) => (
                <tr
                  key={c.profile_id}
                  className="border-b border-white/5 text-zinc-300"
                >
                  <td className="py-3 pr-4 text-zinc-500">{i + 1}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-white">
                    {c.profile_id}
                  </td>
                  <td className="py-3 pr-4">{c.caption_count}</td>
                  <td className="py-3 font-semibold text-cyan-400">
                    {c.total_likes}
                  </td>
                </tr>
              ))}
              {topContributors.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-zinc-500">
                    No contributors yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
