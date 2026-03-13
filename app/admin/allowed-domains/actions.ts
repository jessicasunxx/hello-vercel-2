"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function createAllowedDomain(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const domain = (formData.get("domain") as string | null)?.trim();
  if (!domain) throw new Error("Domain is required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("allowed_signup_domains").insert({ domain });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/allowed-domains");
}

export async function updateAllowedDomain(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const id = formData.get("id") as string | null;
  if (!id) throw new Error("Missing id.");
  const domain = (formData.get("domain") as string | null)?.trim();
  if (!domain) throw new Error("Domain is required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("allowed_signup_domains")
    .update({ domain })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/allowed-domains");
}

export async function deleteAllowedDomain(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const id = formData.get("id") as string | null;
  if (!id) throw new Error("Missing id.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("allowed_signup_domains")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/allowed-domains");
}
