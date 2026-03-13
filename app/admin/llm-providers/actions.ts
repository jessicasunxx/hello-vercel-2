"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function createLLMProvider(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const name = (formData.get("name") as string | null)?.trim();
  const api_base_url = (formData.get("api_base_url") as string | null)?.trim() || null;
  if (!name) throw new Error("Name is required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("llm_providers")
    .insert({ name, api_base_url: api_base_url || undefined });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/llm-providers");
}

export async function updateLLMProvider(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const id = formData.get("id") as string | null;
  if (!id) throw new Error("Missing id.");
  const name = (formData.get("name") as string | null)?.trim();
  const api_base_url = (formData.get("api_base_url") as string | null)?.trim() || null;
  if (!name) throw new Error("Name is required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("llm_providers")
    .update({ name, api_base_url: api_base_url || undefined })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/llm-providers");
}

export async function deleteLLMProvider(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const id = formData.get("id") as string | null;
  if (!id) throw new Error("Missing id.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("llm_providers").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/llm-providers");
}
