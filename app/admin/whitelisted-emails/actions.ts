"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function createWhitelistedEmail(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const email = (formData.get("email") as string | null)?.trim();
  if (!email) throw new Error("Email is required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("whitelisted_emails").insert({ email });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/whitelisted-emails");
}

export async function updateWhitelistedEmail(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const id = formData.get("id") as string | null;
  if (!id) throw new Error("Missing id.");
  const email = (formData.get("email") as string | null)?.trim();
  if (!email) throw new Error("Email is required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("whitelisted_emails")
    .update({ email })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/whitelisted-emails");
}

export async function deleteWhitelistedEmail(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const id = formData.get("id") as string | null;
  if (!id) throw new Error("Missing id.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("whitelisted_emails").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/whitelisted-emails");
}
