import { redirect } from "next/navigation";
import { requireSuperadmin } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Check environment variables first before attempting any Supabase operations
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect("/login?error=config");
  }

  let profile, supabase;
  try {
    const authResult = await requireSuperadmin();
    profile = authResult.profile;
    supabase = await getSupabaseServerClient();
  } catch {
    // If auth fails, redirect to login
    redirect("/login");
  }

  // Fetch statistics
  const [usersResult, imagesResult, captionsResult] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("images").select("id", { count: "exact", head: true }),
    supabase.from("captions").select("id", { count: "exact", head: true }),
  ]);

  const userCount = usersResult.count || 0;
  const imageCount = imagesResult.count || 0;
  const captionCount = captionsResult.count || 0;

  // Get recent activity stats
  const { data: recentImages } = await supabase
    .from("images")
    .select("created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: recentCaptions } = await supabase
    .from("captions")
    .select("created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  const imagesToday = recentImages?.filter(
    (img) =>
      new Date(img.created_at).toDateString() === new Date().toDateString()
  ).length || 0;

  const captionsToday = recentCaptions?.filter(
    (cap) =>
      new Date(cap.created_at).toDateString() === new Date().toDateString()
  ).length || 0;

  // Get superadmin count
  const { count: superadminCount } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("is_superadmin", true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">
              Welcome back, {profile.full_name || profile.email}
            </p>
          </div>
          <Link
            href="/logout"
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700"
          >
            Logout
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={userCount}
            subtitle={`${superadminCount || 0} superadmins`}
            icon="👥"
            gradient="from-blue-500 to-cyan-500"
          />
          <StatCard
            title="Total Images"
            value={imageCount}
            subtitle={`${imagesToday} added today`}
            icon="🖼️"
            gradient="from-purple-500 to-pink-500"
          />
          <StatCard
            title="Total Captions"
            value={captionCount}
            subtitle={`${captionsToday} added today`}
            icon="💬"
            gradient="from-green-500 to-emerald-500"
          />
          <StatCard
            title="Activity Rate"
            value={`${imagesToday + captionsToday}`}
            subtitle="items today"
            icon="📊"
            gradient="from-orange-500 to-red-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <ActionCard
            title="Manage Users"
            description="View all user profiles"
            href="/admin/users"
            icon="👥"
          />
          <ActionCard
            title="Manage Images"
            description="Create, edit, and delete images"
            href="/admin/images"
            icon="🖼️"
          />
          <ActionCard
            title="View Captions"
            description="Browse all captions"
            href="/admin/captions"
            icon="💬"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  gradient,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  gradient: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur transition hover:border-slate-700">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition group-hover:opacity-10`}></div>
      <div className="relative">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-2xl">{icon}</span>
          <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${gradient} opacity-20`}></div>
        </div>
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <p className="mt-1 text-3xl font-bold text-white">{value}</p>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur transition hover:border-slate-700 hover:bg-slate-900/70"
    >
      <div className="mb-3 text-3xl">{icon}</div>
      <h3 className="mb-1 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
      <div className="mt-4 text-sm text-sky-400 transition group-hover:text-sky-300">
        View →
      </div>
    </Link>
  );
}
