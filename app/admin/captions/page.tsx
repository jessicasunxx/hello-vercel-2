import { requireSuperadmin } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function CaptionsPage() {
  await requireSuperadmin();
  const supabase = await getSupabaseServerClient();

  const { data: captions, error } = await supabase
    .from("captions")
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
            Error loading captions: {error.message}
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
          <h1 className="text-3xl font-bold text-white">Captions</h1>
          <div className="text-sm text-slate-400">
            {captions?.length || 0} total captions
          </div>
        </div>

        {captions && captions.length > 0 ? (
          <div className="space-y-4">
            {captions.map((caption) => (
              <div
                key={caption.id}
                className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur transition hover:border-slate-700"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-lg text-white">{caption.text || "No text"}</p>
                    {caption.image_id && (
                      <p className="mt-1 text-xs text-slate-500">
                        Image ID: {caption.image_id}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-xs text-slate-500">
                      {caption.created_at
                        ? new Date(caption.created_at).toLocaleString()
                        : "N/A"}
                    </div>
                    {caption.user_id && (
                      <div className="mt-1 text-xs text-slate-600">
                        User: {caption.user_id.slice(0, 8)}...
                      </div>
                    )}
                  </div>
                </div>
                {caption.rating !== null && caption.rating !== undefined && (
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-medium text-purple-300">
                      Rating: {caption.rating}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-12 text-center backdrop-blur">
            <p className="text-slate-400">No captions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
