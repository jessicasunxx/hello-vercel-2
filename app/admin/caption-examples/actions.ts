"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function createCaptionExample(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const content = (formData.get("content") as string | null)?.trim();
  const image_id = (formData.get("image_id") as string | null)?.trim() || null;
  if (!content) throw new Error("Content is required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("caption_examples")
    .insert({ content, image_id: image_id || undefined });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/caption-examples");
}

export async function updateCaptionExample(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const id = formData.get("id") as string | null;
  if (!id) throw new Error("Missing id.");
  const content = (formData.get("content") as string | null)?.trim();
  const image_id = (formData.get("image_id") as string | null)?.trim() || null;
  if (!content) throw new Error("Content is required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("caption_examples")
    .update({ content, image_id: image_id || undefined })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/caption-examples");
}

export async function deleteCaptionExample(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const id = formData.get("id") as string | null;
  if (!id) throw new Error("Missing id.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("caption_examples").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/caption-examples");
}
