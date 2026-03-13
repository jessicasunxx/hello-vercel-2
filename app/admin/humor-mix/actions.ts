"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

export async function updateHumorMix(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const id = formData.get("id") as string | null;
  if (!id) throw new Error("Missing id.");

  const update: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key === "id") continue;
    const str = value instanceof File ? await value.text() : String(value);
    update[key] = str === "" ? null : str;
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("humor_mix")
    .update(update)
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/humor-mix");
}
