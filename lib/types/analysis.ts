export type AnalysisStatus = "pending" | "processing" | "completed" | "failed";

export interface FabricAnalysisResult {
  fabricType: string;
  threadDensity: number;
  warpCount: number;
  weftCount: number;
  confidence: number;
}

export type QualityGrade = "A" | "B" | "C";
export type ProcurementVerdict = "approve" | "review" | "reject";
export type RiskLevel = "low" | "medium" | "high";

export interface StandardMatch {
  application: string;
  status: "pass" | "marginal" | "fail";
  note: string;
}

export interface FabricProcurementInsight {
  estimatedGsm: number;
  weaveType: string;
  warpWeftRatio: number;
  qualityGrade: QualityGrade;
  recommendedUses: string[];
  standardsMatch: StandardMatch[];
  procurementVerdict: ProcurementVerdict;
  verdictSummary: string;
  supplierChecklist: string[];
  shrinkageRisk: RiskLevel;
  durabilityScore: number;
  coverFactor: number;
  bestMatchedApplication: string;
}

export interface FabricAnalysisReport {
  results: FabricAnalysisResult;
  procurement: FabricProcurementInsight;
}

export interface AnalysisRecord {
  id: string;
  userId: string | null;
  imageUrl: string;
  fileName: string;
  warpCount: number | null;
  weftCount: number | null;
  threadDensity: number | null;
  fabricType: string | null;
  confidence: number | null;
  status: AnalysisStatus;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string | null;
  email: string | null;
  updatedAt: string | null;
}

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
