import { requireSuperadmin } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImageForm from "../../ImageForm";

export default async function EditImagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSuperadmin();
  const { id } = await params;
  const supabase = await getSupabaseServerClient();

  const { data: image, error } = await supabase
    .from("images")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !image) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/admin/images"
          className="mb-6 inline-block text-sm text-slate-400 hover:text-slate-300"
        >
          ← Back to Images
        </Link>

        <h1 className="mb-6 text-3xl font-bold text-white">Edit Image</h1>

        <div className="mx-auto max-w-2xl">
          <ImageForm image={image} />
        </div>
      </div>
    </div>
  );
}
