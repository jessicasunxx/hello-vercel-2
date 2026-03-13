"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

function normalizeCheckbox(value: FormDataEntryValue | null) {
  return value === "on";
}

const IMAGE_BUCKET = "images";

export async function createImage(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to create images.");
  }

  let url = (formData.get("url") as string | null)?.trim() || null;
  const file = formData.get("file") as File | null;

  if (file && file.size > 0) {
    const supabase = await createSupabaseServerClient();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(path, file, { upsert: false, contentType: file.type });
    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }
    const { data: urlData } = supabase.storage
      .from(IMAGE_BUCKET)
      .getPublicUrl(path);
    url = urlData.publicUrl;
  }

  if (!url) {
    throw new Error("Provide an image URL or upload a file.");
  }

  const imageDescription =
    (formData.get("image_description") as string | null)?.trim() || null;
  const isPublic = normalizeCheckbox(formData.get("is_public"));
  const isCommonUse = normalizeCheckbox(formData.get("is_common_use"));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("images").insert({
    url,
    image_description: imageDescription,
    is_public: isPublic,
    is_common_use: isCommonUse,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/images");
}

export async function updateImage(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to update images.");
  }

  const id = formData.get("id") as string | null;
  if (!id) {
    throw new Error("Missing image id.");
  }

  const url = (formData.get("url") as string | null)?.trim() || null;
  const imageDescription =
    (formData.get("image_description") as string | null)?.trim() || null;
  const isPublic = normalizeCheckbox(formData.get("is_public"));
  const isCommonUse = normalizeCheckbox(formData.get("is_common_use"));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("images")
    .update({
      url,
      image_description: imageDescription,
      is_public: isPublic,
      is_common_use: isCommonUse,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/images");
}

export async function deleteImage(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) {
    throw new Error("Not authorized to delete images.");
  }

  const id = formData.get("id") as string | null;
  if (!id) {
    throw new Error("Missing image id.");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("images").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/images");
}
