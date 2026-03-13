"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function createLLMModel(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const name = (formData.get("name") as string | null)?.trim();
  const provider_id = (formData.get("provider_id") as string | null)?.trim() || null;
  const model_id = (formData.get("model_id") as string | null)?.trim() || null;
  if (!name) throw new Error("Name is required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("llm_models").insert({
    name,
    provider_id: provider_id || undefined,
    model_id: model_id || undefined,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/llm-models");
}

export async function updateLLMModel(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const id = formData.get("id") as string | null;
  if (!id) throw new Error("Missing id.");
  const name = (formData.get("name") as string | null)?.trim();
  const provider_id = (formData.get("provider_id") as string | null)?.trim() || null;
  const model_id = (formData.get("model_id") as string | null)?.trim() || null;
  if (!name) throw new Error("Name is required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("llm_models")
    .update({
      name,
      provider_id: provider_id || undefined,
      model_id: model_id || undefined,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/llm-models");
}

export async function deleteLLMModel(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const id = formData.get("id") as string | null;
  if (!id) throw new Error("Missing id.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("llm_models").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/llm-models");
}
