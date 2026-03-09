"use client";

import { useRef } from "react";

type ImageRecord = {
  id: string;
  url: string | null;
  image_description: string | null;
  is_public: boolean | null;
  is_common_use: boolean | null;
};

type ImageActionsProps = {
  image: ImageRecord;
  updateImage: (formData: FormData) => Promise<void>;
  deleteImage: (formData: FormData) => Promise<void>;
};

export default function ImageActions({
  image,
  updateImage,
  deleteImage,
}: ImageActionsProps) {
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  const closeDetails = () => {
    detailsRef.current?.removeAttribute("open");
  };

  return (
    <details
      ref={detailsRef}
      className="mt-4 rounded-xl border border-white/10 bg-zinc-800/50 p-4"
    >
      <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400/90">
        Edit or delete
      </summary>
      <form
        action={updateImage}
        className="mt-4 grid gap-4 lg:grid-cols-2"
        onSubmit={closeDetails}
      >
        <input type="hidden" name="id" value={image.id} />
        <label className="text-sm text-zinc-400">
          Image URL
          <input
            name="url"
            defaultValue={image.url ?? ""}
            className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
        </label>
        <label className="text-sm text-zinc-400 lg:col-span-2">
          Image description
          <textarea
            name="image_description"
            defaultValue={image.image_description ?? ""}
            className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            rows={2}
          />
        </label>
        <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_public"
              defaultChecked={image.is_public ?? false}
              className="h-4 w-4 rounded border-white/20 bg-zinc-800 text-cyan-500 focus:ring-cyan-500/50"
            />
            Public
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_common_use"
              defaultChecked={image.is_common_use ?? false}
              className="h-4 w-4 rounded border-white/20 bg-zinc-800 text-cyan-500 focus:ring-cyan-500/50"
            />
            Common use
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            Save changes
          </button>
        </div>
      </form>

      <form action={deleteImage} className="mt-4" onSubmit={closeDetails}>
        <input type="hidden" name="id" value={image.id} />
        <button
          type="submit"
          className="rounded-xl border border-red-500/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-red-400 transition hover:border-red-500/50 hover:bg-red-500/10"
        >
          Delete image
        </button>
      </form>
    </details>
  );
}
