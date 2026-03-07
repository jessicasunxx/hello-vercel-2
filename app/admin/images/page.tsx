import { requireSuperadmin } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import ImageActions from "./ImageActions";

export default async function ImagesPage() {
  await requireSuperadmin();
  const supabase = await getSupabaseServerClient();

  const { data: images, error } = await supabase
    .from("images")
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
            Error loading images: {error.message}
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
          <h1 className="text-3xl font-bold text-white">Manage Images</h1>
          <Link
            href="/admin/images/new"
            className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-400"
          >
            + Add New Image
          </Link>
        </div>

        {images && images.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur transition hover:border-slate-700"
              >
                {image.url && (
                  <div className="aspect-video w-full overflow-hidden bg-slate-800">
                    <img
                      src={image.url}
                      alt={image.title || "Image"}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="mb-1 font-semibold text-white">
                    {image.title || "Untitled"}
                  </h3>
                  {image.description && (
                    <p className="mb-3 line-clamp-2 text-sm text-slate-400">
                      {image.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {image.created_at
                        ? new Date(image.created_at).toLocaleDateString()
                        : "N/A"}
                    </span>
                    <ImageActions imageId={image.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-12 text-center backdrop-blur">
            <p className="text-slate-400">No images found</p>
            <Link
              href="/admin/images/new"
              className="mt-4 inline-block text-sky-400 hover:text-sky-300"
            >
              Create your first image →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
