import { createSupabaseServerClient } from "@/lib/supabase/server";
import ImageActions from "./ImageActions";
import { createImage, deleteImage, updateImage } from "./actions";

export const dynamic = "force-dynamic";

export default async function ImagesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: images } = await supabase
    .from("images")
    .select(
      "id, url, image_description, is_public, is_common_use, created_datetime_utc, profile_id"
    )
    .order("created_datetime_utc", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">
            Images
          </p>
          <h2 className="text-3xl font-semibold text-white">
            Image management
          </h2>
        </div>
        <a
          href="/admin"
          className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
        >
          Dashboard
        </a>
      </header>

      <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white">
          Add a new image
        </h3>
        <form action={createImage} className="mt-4 grid gap-4 lg:grid-cols-2">
          <label className="text-sm text-zinc-400">
            Image URL
            <input
              name="url"
              className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-3 text-white placeholder-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              placeholder="https://..."
              required
            />
          </label>
          <label className="text-sm text-zinc-400 lg:col-span-2">
            Image description
            <textarea
              name="image_description"
              className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-800/80 px-4 py-3 text-white placeholder-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              rows={3}
              placeholder="Describe what is happening in the image."
            />
          </label>
          <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_public"
                className="h-4 w-4 rounded border-white/20 bg-zinc-800 text-cyan-500 focus:ring-cyan-500/50"
              />
              Public
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_common_use"
                className="h-4 w-4 rounded border-white/20 bg-zinc-800 text-cyan-500 focus:ring-cyan-500/50"
              />
              Common use
            </label>
          </div>
          <button
            type="submit"
            className="rounded-xl bg-cyan-500/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 transition hover:bg-cyan-500/30"
          >
            Create image
          </button>
        </form>
      </section>

      <section className="space-y-4">
        {(images ?? []).map((image) => (
          <article
            key={image.id}
            className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-lg"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-xl border border-white/10 bg-zinc-800">
                  {image.url ? (
                    <img
                      src={image.url}
                      alt="Uploaded"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      No image
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                    {image.created_datetime_utc ?? "No timestamp"}
                  </p>
                  <p className="mt-2 text-xs text-zinc-500">
                    Profile: {image.profile_id ?? "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">
                  {image.is_public ? "Public" : "Private"}
                </span>
                <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">
                  {image.is_common_use ? "Common" : "Single-use"}
                </span>
              </div>
            </div>

            <ImageActions
              image={image}
              updateImage={updateImage}
              deleteImage={deleteImage}
            />
          </article>
        ))}
        {(images ?? []).length === 0 && (
          <p className="text-sm text-zinc-500">No images found.</p>
        )}
      </section>
    </div>
  );
}
