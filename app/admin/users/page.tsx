import { requireSuperadmin } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function UsersPage() {
  await requireSuperadmin();
  const supabase = await getSupabaseServerClient();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/admin"
            className="mb-4 inline-block text-sm text-slate-400 hover:text-slate-300"
          >
            ← Back to Dashboard
          </Link>
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-200">
            Error loading users: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/admin"
          className="mb-6 inline-block text-sm text-slate-400 hover:text-slate-300"
        >
          ← Back to Dashboard
        </Link>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Users & Profiles</h1>
          <div className="text-sm text-slate-400">
            {profiles?.length || 0} total users
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-800 bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {profiles?.map((profile) => (
                  <tr
                    key={profile.id}
                    className="transition hover:bg-slate-900/30"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        {profile.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt={profile.full_name || profile.email || ""}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-sm font-medium text-slate-300">
                            {(profile.full_name || profile.email || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-white">
                            {profile.full_name || "No name"}
                          </div>
                          <div className="text-xs text-slate-500">
                            {profile.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-300">
                        {profile.email || "No email"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {profile.is_superadmin ? (
                        <span className="inline-flex items-center rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-medium text-purple-300">
                          Superadmin
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-700/50 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {profile.created_at
                        ? new Date(profile.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
                {(!profiles || profiles.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
