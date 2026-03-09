import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type CaptionsPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default async function CaptionsPage({ searchParams }: CaptionsPageProps) {
  const supabase = await createSupabaseServerClient();
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const query = (resolvedSearchParams?.q ?? "").trim();

  let captionsQuery = supabase
    .from("captions")
    .select(
      "id, content, created_datetime_utc, is_public, is_featured, like_count, profile_id, image_id, image:images(url)"
    )
    .not("content", "is", null)
    .neq("content", "")
    .order("created_datetime_utc", { ascending: false })
    .limit(100);

  if (query) {
    const looksLikeUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        query
      );

    captionsQuery = looksLikeUuid
      ? captionsQuery.or(
          [
            `content.ilike.%${query}%`,
            `profile_id.eq.${query}`,
            `image_id.eq.${query}`,
          ].join(",")
        )
      : captionsQuery.ilike("content", `%${query}%`);
  }

  const { data: captions } = await captionsQuery;
  const captionRows =
    (captions as Array<{
      id: string;
      content: string | null;
      created_datetime_utc: string | null;
      is_public: boolean | null;
      is_featured: boolean | null;
      like_count: number | null;
      profile_id: string | null;
      image_id: string | null;
      image?: { url: string | null } | { url: string | null }[] | null;
    }>) ?? [];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">
            Captions
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Caption review
          </h2>
        </div>
        <a
          href="/admin"
          className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
        >
          Dashboard
        </a>
      </header>
      <form className="flex flex-wrap gap-3" method="get">
        <input
          name="q"
          defaultValue={query}
          placeholder="Search captions, profile ID, or image ID"
          className="w-full max-w-xl rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
        />
        <button
          type="submit"
          className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
        >
          Search
        </button>
        {query ? (
          <a
            href="/admin/captions"
            className="inline-flex items-center rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            Clear
          </a>
        ) : null}
      </form>

      <div className="grid gap-4">
        {captionRows.map((caption) => (
          <article
            key={caption.id}
            className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-lg"
          >
            {(() => {
              const imageUrl = Array.isArray(caption.image)
                ? caption.image[0]?.url
                : caption.image?.url;

              return (
            <div className="grid gap-4 lg:grid-cols-[160px_1fr]">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-800">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Caption source"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full min-h-[120px] items-center justify-center text-xs uppercase tracking-[0.2em] text-zinc-500">
                    No image
                  </div>
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                    {caption.created_datetime_utc ?? "No timestamp"}
                  </p>
                  <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">
                      {caption.is_public ? "Public" : "Private"}
                    </span>
                    {caption.is_featured && (
                      <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-cyan-400">
                        Featured
                      </span>
                    )}
                    <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">
                      {caption.like_count ?? 0} likes
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-lg font-semibold text-white">
                  {caption.content || "Untitled caption"}
                </p>
                <div className="mt-3 text-xs text-zinc-500">
                  <p>Profile: {caption.profile_id ?? "N/A"}</p>
                  <p>Image: {caption.image_id ?? "N/A"}</p>
                </div>
              </div>
            </div>
              );
            })()}
          </article>
        ))}
        {captionRows.length === 0 && (
          <p className="text-sm text-zinc-500">
            {query ? "No captions match that search." : "No captions found."}
          </p>
        )}
      </div>
    </div>
  );
}
