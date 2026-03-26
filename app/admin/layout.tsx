import { redirect } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";
import { requireAdmin } from "@/lib/supabase/require-admin";
import SignOutButton from "./SignOutButton";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminCheck = await requireAdmin();

  if (!adminCheck.ok) {
    if (adminCheck.reason === "unauthenticated") {
      redirect("/login");
    }
    redirect("/denied");
  }

  const displayName =
    adminCheck.profile.first_name || adminCheck.profile.last_name
      ? `${adminCheck.profile.first_name ?? ""} ${adminCheck.profile.last_name ?? ""}`.trim()
      : adminCheck.profile.email ?? "Superadmin";

  return (
    <div className="min-h-screen text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-zinc-950/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-400/70">
              Humor Project
            </p>
            <h1 className="text-xl font-semibold text-white">Admin Deck</h1>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <ThemeToggle />
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">
              <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-500">
                Signed in
              </p>
              <p className="text-sm font-semibold text-white">{displayName}</p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl px-6 py-10">{children}</div>
    </div>
  );
}
