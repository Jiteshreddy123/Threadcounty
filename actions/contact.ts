"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types/analysis";

export async function submitContactAction(
  firstName: string,
  lastName: string,
  email: string,
  subject: string,
  message: string
): Promise<ActionResult<null>> {
  try {
    if (!firstName.trim() || !email.trim() || !message.trim()) {
      return { success: false, error: "Please fill in all required fields." };
    }

    const supabase = await createClient();

    // Try to save to contact_messages table; fail gracefully if table doesn't exist
    const { error } = await supabase.from("contact_messages").insert({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim() || "General Inquiry",
      message: message.trim(),
      created_at: new Date().toISOString(),
    });

    if (error && error.code !== "42P01" && error.code !== "PGRST205") {
      throw new Error(error.message);
    }

    return { success: true, data: null };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to send message",
    };
  }
}
