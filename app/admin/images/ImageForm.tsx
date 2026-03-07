"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ImageForm({
  image,
}: {
  image?: {
    id: string;
    title?: string | null;
    description?: string | null;
    url?: string | null;
  };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: image?.title || "",
    description: image?.description || "",
    url: image?.url || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = image
        ? `/api/admin/images/${image.id}`
        : "/api/admin/images";
      const method = image ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/images");
        router.refresh();
      } else {
        const error = await res.text();
        alert(`Failed to save: ${error}`);
      }
    } catch (error) {
      alert("Error saving image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur"
    >
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
          placeholder="Image title"
          required
        />
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
          placeholder="Image description"
          rows={4}
        />
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Image URL
        </label>
        <input
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-sky-500 px-4 py-2 font-medium text-white transition hover:bg-sky-400 disabled:opacity-50"
        >
          {loading ? "Saving..." : image ? "Update Image" : "Create Image"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-300 transition hover:bg-slate-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
