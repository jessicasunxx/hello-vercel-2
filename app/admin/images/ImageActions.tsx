"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ImageActions({ imageId }: { imageId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/images/${imageId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete image");
      }
    } catch (error) {
      alert("Error deleting image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <a
        href={`/admin/images/${imageId}/edit`}
        className="rounded bg-slate-700 px-2 py-1 text-xs text-slate-300 transition hover:bg-slate-600"
      >
        Edit
      </a>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="rounded bg-red-500/20 px-2 py-1 text-xs text-red-300 transition hover:bg-red-500/30 disabled:opacity-50"
      >
        {loading ? "..." : "Delete"}
      </button>
    </div>
  );
}
