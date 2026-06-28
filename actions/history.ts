"use server";

import { createClient } from "@/lib/supabase/server";
import { getAnalyses, deleteAnalysis, deleteAllAnalyses } from "@/services/analyses";
import { deleteStorageFiles, listStorageFiles } from "@/services/storage";
import type { ActionResult, AnalysisRecord } from "@/lib/types/analysis";

export async function fetchHistoryAction(): Promise<ActionResult<AnalysisRecord[]>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const analyses = await getAnalyses(supabase, user?.id);
    return { success: true, data: analyses };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to fetch history",
    };
  }
}

export async function deleteAnalysisAction(
  analysisId: string,
  fileName: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    // Delete from storage first
    await deleteStorageFiles(supabase, [fileName]);
    // Then delete from DB
    await deleteAnalysis(supabase, analysisId);

    return { success: true, data: undefined };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete analysis",
    };
  }
}

export async function deleteAllAnalysesAction(): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    // Delete DB records first
    await deleteAllAnalyses(supabase, user.id);

    // Always purge ALL files from storage directly — this catches any orphaned
    // files that may have been left behind if DB rows were already deleted or
    // the DB and storage fell out of sync.
    const storageFiles = await listStorageFiles(supabase, user.id);
    if (storageFiles.length > 0) {
      await deleteStorageFiles(supabase, storageFiles.map((f) => f.name));
    }

    return { success: true, data: undefined };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to clear history",
    };
  }
}
