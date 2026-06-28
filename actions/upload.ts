"use server";

import { createClient } from "@/lib/supabase/server";
import { uploadFabricImage } from "@/services/storage";
import { createAnalysis } from "@/services/analyses";
import type { ActionResult } from "@/lib/types/analysis";

export interface UploadResult {
  publicUrl: string;
  fileName: string;
  analysisId: string | null;
}

export async function uploadFabricAction(
  formData: FormData
): Promise<ActionResult<UploadResult>> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "File must be under 5MB" };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in to upload fabric images." };
    }

    const { publicUrl, fileName } = await uploadFabricImage(
      supabase,
      file,
      user.id
    );

    const record = await createAnalysis(supabase, {
      userId: user.id,
      imageUrl: publicUrl,
      fileName,
      status: "pending",
    });

    return {
      success: true,
      data: { publicUrl, fileName, analysisId: record?.id ?? null },
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Upload failed",
    };
  }
}
