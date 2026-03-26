"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/require-admin";

const CHAIN_PATH = "/admin/prompt-chain";

function parseUuid(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const t = value.trim();
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(t)
  ) {
    return null;
  }
  return t;
}

export async function createHumorFlavor(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const name = (formData.get("name") as string | null)?.trim();
  const description =
    (formData.get("description") as string | null)?.trim() || null;
  if (!name) throw new Error("Name is required.");

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("humor_flavors")
    .insert({ name, description })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath(CHAIN_PATH);
  redirect(`${CHAIN_PATH}?flavor=${data.id}`);
}

export async function updateHumorFlavor(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const id = parseUuid(formData.get("id"));
  if (!id) throw new Error("Invalid flavor id.");

  const name = (formData.get("name") as string | null)?.trim();
  const description =
    (formData.get("description") as string | null)?.trim() || null;
  if (!name) throw new Error("Name is required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("humor_flavors")
    .update({ name, description })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(CHAIN_PATH);
}

export async function deleteHumorFlavor(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const id = parseUuid(formData.get("id"));
  if (!id) throw new Error("Invalid flavor id.");

  const supabase = await createSupabaseServerClient();
  const { error: stepErr } = await supabase
    .from("humor_flavor_steps")
    .delete()
    .eq("humor_flavor_id", id);
  if (stepErr) throw new Error(stepErr.message);

  const { error } = await supabase.from("humor_flavors").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(CHAIN_PATH);
  redirect(CHAIN_PATH);
}

export async function createHumorFlavorStep(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const humorFlavorId = parseUuid(formData.get("humor_flavor_id"));
  if (!humorFlavorId) throw new Error("Invalid humor flavor.");

  const promptText = (formData.get("prompt_text") as string | null)?.trim();
  if (!promptText) throw new Error("Step prompt is required.");

  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase
    .from("humor_flavor_steps")
    .select("step_number")
    .eq("humor_flavor_id", humorFlavorId)
    .order("step_number", { ascending: false })
    .limit(1);

  const rows = (existing ?? []) as { step_number: number | null }[];
  const maxNum = rows[0]?.step_number ?? 0;
  const step_number = maxNum + 1;

  const { error } = await supabase.from("humor_flavor_steps").insert({
    humor_flavor_id: humorFlavorId,
    step_number,
    prompt_text: promptText,
  });

  if (error) throw new Error(error.message);
  revalidatePath(CHAIN_PATH);
}

export async function updateHumorFlavorStep(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const id = parseUuid(formData.get("id"));
  if (!id) throw new Error("Invalid step id.");

  const humorFlavorId = parseUuid(formData.get("humor_flavor_id"));
  if (!humorFlavorId) throw new Error("Invalid humor flavor.");

  const promptText = (formData.get("prompt_text") as string | null)?.trim();
  if (!promptText) throw new Error("Step prompt is required.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("humor_flavor_steps")
    .update({ prompt_text: promptText })
    .eq("id", id)
    .eq("humor_flavor_id", humorFlavorId);

  if (error) throw new Error(error.message);
  revalidatePath(CHAIN_PATH);
}

export async function deleteHumorFlavorStep(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const id = parseUuid(formData.get("id"));
  if (!id) throw new Error("Invalid step id.");

  const humorFlavorId = parseUuid(formData.get("humor_flavor_id"));
  if (!humorFlavorId) throw new Error("Invalid humor flavor.");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("humor_flavor_steps")
    .delete()
    .eq("id", id)
    .eq("humor_flavor_id", humorFlavorId);

  if (error) throw new Error(error.message);

  const { data: rest } = await supabase
    .from("humor_flavor_steps")
    .select("id, step_number")
    .eq("humor_flavor_id", humorFlavorId)
    .order("step_number", { ascending: true });

  const ordered = (rest ?? []) as { id: string; step_number: number | null }[];
  for (let i = 0; i < ordered.length; i++) {
    const want = i + 1;
    if (ordered[i].step_number !== want) {
      await supabase
        .from("humor_flavor_steps")
        .update({ step_number: want })
        .eq("id", ordered[i].id);
    }
  }

  revalidatePath(CHAIN_PATH);
}

export async function moveHumorFlavorStep(formData: FormData) {
  const adminCheck = await requireAdmin();
  if (!adminCheck.ok) throw new Error("Not authorized.");

  const humorFlavorId = parseUuid(formData.get("humor_flavor_id"));
  const stepId = parseUuid(formData.get("step_id"));
  const direction = (formData.get("direction") as string | null)?.trim();

  if (!humorFlavorId || !stepId || (direction !== "up" && direction !== "down")) {
    throw new Error("Invalid reorder request.");
  }

  const supabase = await createSupabaseServerClient();
  const { data: rows, error } = await supabase
    .from("humor_flavor_steps")
    .select("id, step_number")
    .eq("humor_flavor_id", humorFlavorId)
    .order("step_number", { ascending: true });

  if (error) throw new Error(error.message);

  const steps = (rows ?? []) as { id: string; step_number: number | null }[];
  const idx = steps.findIndex((s) => s.id === stepId);
  if (idx < 0) throw new Error("Step not found.");

  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= steps.length) {
    return;
  }

  const a = steps[idx];
  const b = steps[swapWith];
  const aNum = a.step_number ?? idx + 1;
  const bNum = b.step_number ?? swapWith + 1;

  const { error: e1 } = await supabase
    .from("humor_flavor_steps")
    .update({ step_number: bNum })
    .eq("id", a.id);
  if (e1) throw new Error(e1.message);

  const { error: e2 } = await supabase
    .from("humor_flavor_steps")
    .update({ step_number: aNum })
    .eq("id", b.id);
  if (e2) throw new Error(e2.message);

  revalidatePath(CHAIN_PATH);
}
