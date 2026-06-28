"use server";

import { createClient } from "@/lib/supabase/server";
import { getProfile, updateProfile } from "@/services/auth";
import type { ActionResult, UserProfile } from "@/lib/types/analysis";
import { revalidatePath } from "next/cache";

export async function fetchProfileAction(): Promise<ActionResult<UserProfile | null>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: true, data: null };
    const profile = await getProfile(supabase, user.id);
    return { success: true, data: profile };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to fetch profile",
    };
  }
}

export async function updateProfileAction(
  fullName: string
): Promise<ActionResult<UserProfile>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const profile = await updateProfile(supabase, user.id, fullName);
    revalidatePath("/dashboard");
    return { success: true, data: profile };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update profile",
    };
  }
}

export async function signOutAction(): Promise<ActionResult<null>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) return { success: false, error: error.message };
    return { success: true, data: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Sign out failed",
    };
  }
}
