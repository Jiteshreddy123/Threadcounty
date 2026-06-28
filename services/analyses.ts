import type { SupabaseClient } from "@supabase/supabase-js";
import type { AnalysisRecord, AnalysisStatus, FabricAnalysisResult } from "@/lib/types/analysis";
import { listStorageFiles, type StorageFileItem } from "@/services/storage";

function mapRow(row: Record<string, unknown>): AnalysisRecord {
  return {
    id: row.id as string,
    userId: (row.user_id as string) ?? null,
    imageUrl: row.image_url as string,
    fileName: row.file_name as string,
    warpCount: row.warp_count as number | null,
    weftCount: row.weft_count as number | null,
    threadDensity: row.thread_density as number | null,
    fabricType: row.fabric_type as string | null,
    confidence: row.confidence as number | null,
    status: row.status as AnalysisStatus,
    createdAt: row.created_at as string,
  };
}

function isAnalysesUnavailable(error: { code?: string; message?: string }): boolean {
  const msg = error.message ?? "";
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    error.code === "42501" ||
    msg.includes("does not exist") ||
    msg.includes("schema cache") ||
    msg.includes("Could not find the table") ||
    msg.includes("row-level security")
  );
}

function storageItemToRecord(item: StorageFileItem, userId?: string | null): AnalysisRecord {
  return {
    id: item.id,
    userId: userId ?? null,
    imageUrl: item.imageUrl,
    fileName: item.name,
    warpCount: null,
    weftCount: null,
    threadDensity: null,
    fabricType: null,
    confidence: null,
    status: "completed",
    createdAt: item.createdAt,
  };
}

export async function getAnalyses(
  supabase: SupabaseClient,
  userId?: string | null
): Promise<AnalysisRecord[]> {
  let query = supabase
    .from("analyses")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;

  if (error) {
    // Fallback to storage when analyses table isn't set up or RLS blocks access
    if (isAnalysesUnavailable(error)) {
      const files = await listStorageFiles(supabase, userId);
      return files.map((f) => storageItemToRecord(f, userId));
    }
    throw new Error(error.message);
  }

  return (data ?? []).map(mapRow);
}

export async function createAnalysis(
  supabase: SupabaseClient,
  params: {
    userId?: string | null;
    imageUrl: string;
    fileName: string;
    status?: AnalysisStatus;
  }
): Promise<AnalysisRecord | null> {
  const { data, error } = await supabase
    .from("analyses")
    .insert({
      user_id: params.userId ?? null,
      image_url: params.imageUrl,
      file_name: params.fileName,
      status: params.status ?? "pending",
    })
    .select()
    .single();

  if (error) {
    // Non-fatal: storage upload already succeeded; DB is optional until migration is run
    if (isAnalysesUnavailable(error)) return null;
    throw new Error(error.message);
  }

  return mapRow(data);
}

export async function updateAnalysisResults(
  supabase: SupabaseClient,
  analysisId: string,
  results: FabricAnalysisResult
): Promise<AnalysisRecord | null> {
  const { data, error } = await supabase
    .from("analyses")
    .update({
      warp_count: results.warpCount,
      weft_count: results.weftCount,
      thread_density: results.threadDensity,
      fabric_type: results.fabricType,
      confidence: results.confidence,
      status: "completed",
    })
    .eq("id", analysisId)
    .select()
    .single();

  if (error) {
    if (isAnalysesUnavailable(error)) return null;
    throw new Error(error.message);
  }

  return mapRow(data);
}

export async function setAnalysisStatus(
  supabase: SupabaseClient,
  analysisId: string,
  status: AnalysisStatus
): Promise<void> {
  const { error } = await supabase
    .from("analyses")
    .update({ status })
    .eq("id", analysisId);

  if (error && !isAnalysesUnavailable(error)) {
    throw new Error(error.message);
  }
}

export async function deleteAnalysis(
  supabase: SupabaseClient,
  analysisId: string
): Promise<void> {
  const { error } = await supabase.from("analyses").delete().eq("id", analysisId);
  if (error && !isAnalysesUnavailable(error)) {
    throw new Error(error.message);
  }
}

export async function deleteAllAnalyses(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const { error } = await supabase.from("analyses").delete().eq("user_id", userId);
  if (error && !isAnalysesUnavailable(error)) {
    throw new Error(error.message);
  }
}
