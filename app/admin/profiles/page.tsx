import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ProfilesPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default async function ProfilesPage({ searchParams }: ProfilesPageProps) {
  const supabase = await createSupabaseServerClient();
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const query = (resolvedSearchParams?.q ?? "").trim();

  let profilesQuery = supabase
    .from("profiles")
    .select(
      "id, first_name, last_name, email, is_superadmin, is_matrix_admin, is_in_study, created_datetime_utc"
    )
    .order("created_datetime_utc", { ascending: false })
    .limit(100);

  if (query) {
    const looksLikeUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        query
      );

    profilesQuery = looksLikeUuid
      ? profilesQuery.or(
          [
            `id.eq.${query}`,
            `email.ilike.%${query}%`,
            `first_name.ilike.%${query}%`,
            `last_name.ilike.%${query}%`,
          ].join(",")
        )
      : profilesQuery.or(
          [
            `email.ilike.%${query}%`,
            `first_name.ilike.%${query}%`,
            `last_name.ilike.%${query}%`,
          ].join(",")
        );
  }

  const { data: profiles } = await profilesQuery;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">
            Profiles
          </p>
          <h2 className="text-3xl font-semibold text-white">
            User directory
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
          placeholder="Search by name, email, or profile ID"
          className="w-full max-w-xl rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white placeholder-zinc-500 shadow-sm focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
        />
        <button
          type="submit"
          className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
        >
          Search
        </button>
        {query ? (
          <a
            href="/admin/profiles"
            className="inline-flex items-center rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            Clear
          </a>
        ) : null}
      </form>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 shadow-lg">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-zinc-800/80 text-xs uppercase tracking-[0.2em] text-zinc-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Roles</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {(profiles ?? []).map((profile) => (
              <tr key={profile.id} className="border-t border-white/5">
                <td className="px-4 py-3 font-semibold text-white">
                  {profile.first_name || profile.last_name
                    ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()
                    : "Unnamed"}
                </td>
                <td className="px-4 py-3 text-zinc-400">
                  {profile.email ?? "No email"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                    {profile.is_superadmin && (
                      <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-cyan-400">
                        Superadmin
                      </span>
                    )}
                    {profile.is_matrix_admin && (
                      <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">
                        Matrix Admin
                      </span>
                    )}
                    {profile.is_in_study && (
                      <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">
                        In Study
                      </span>
                    )}
                    {!profile.is_superadmin &&
                      !profile.is_matrix_admin &&
                      !profile.is_in_study && (
                        <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">
                          Standard
                        </span>
                      )}
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-500">
                  {profile.created_datetime_utc ?? "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(profiles ?? []).length === 0 && (
          <p className="px-4 py-6 text-sm text-zinc-500">
            {query ? "No profiles match that search." : "No profiles found."}
          </p>
        )}
      </div>
    </div>
  );
}
