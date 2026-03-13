"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function createTerm(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const term = (formData.get("term") as string | null)?.trim();
  const definition = (formData.get("definition") as string | null)?.trim() || null;
  if (!term) throw new Error("Term is required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("terms").insert({ term, definition });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/terms");
}

export async function updateTerm(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const id = formData.get("id") as string | null;
  if (!id) throw new Error("Missing id.");
  const term = (formData.get("term") as string | null)?.trim();
  const definition = (formData.get("definition") as string | null)?.trim() || null;
  if (!term) throw new Error("Term is required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("terms")
    .update({ term, definition })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/terms");
}

export async function deleteTerm(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const id = formData.get("id") as string | null;
  if (!id) throw new Error("Missing id.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("terms").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/terms");
}
