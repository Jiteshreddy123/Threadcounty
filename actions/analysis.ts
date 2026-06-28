"use server";

import { createClient } from "@/lib/supabase/server";
import { analyzeFabricWithVision } from "@/services/ai-vision";
import {
  createAnalysis,
  setAnalysisStatus,
  updateAnalysisResults,
} from "@/services/analyses";
import type { ActionResult, FabricAnalysisReport } from "@/lib/types/analysis";
import { generateProcurementInsight } from "@/services/textile-engineering";

export interface AnalyzeFabricInput {
  imageUrl: string;
  fileName?: string;
  analysisId?: string;
}

export interface AnalyzeFabricOutput extends FabricAnalysisReport {
  analysisId: string | null;
}

export async function analyzeFabricAction(
  input: AnalyzeFabricInput
): Promise<ActionResult<AnalyzeFabricOutput>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in to run an analysis." };
    }

    let analysisId = input.analysisId ?? null;

    if (!analysisId) {
      const record = await createAnalysis(supabase, {
        userId: user.id,
        imageUrl: input.imageUrl,
        fileName: input.fileName ?? "fabric-image.jpg",
        status: "processing",
      });
      analysisId = record?.id ?? null;
    } else {
      await setAnalysisStatus(supabase, analysisId, "processing");
    }

    const results = await analyzeFabricWithVision(input.imageUrl);
    const procurement = generateProcurementInsight(results);

    if (analysisId) {
      await updateAnalysisResults(supabase, analysisId, results);
    }

    return { success: true, data: { results, procurement, analysisId } };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Analysis failed",
    };
  }
}
