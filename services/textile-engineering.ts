import type {
  FabricAnalysisResult,
  FabricProcurementInsight,
  ProcurementVerdict,
  QualityGrade,
  RiskLevel,
  StandardMatch,
} from "@/lib/types/analysis";

/** Industry reference specs for common textile applications (EPI/PPI ranges). */
const APPLICATION_STANDARDS = [
  {
    application: "Dress Shirt / Shirting",
    minDensity: 80,
    maxDensity: 140,
    minWarp: 55,
    minWeft: 45,
  },
  {
    application: "Bed Sheet (Percale)",
    minDensity: 180,
    maxDensity: 300,
    minWarp: 100,
    minWeft: 90,
  },
  {
    application: "Denim / Workwear",
    minDensity: 50,
    maxDensity: 95,
    minWarp: 40,
    minWeft: 35,
  },
  {
    application: "Upholstery / Home Décor",
    minDensity: 120,
    maxDensity: 220,
    minWarp: 70,
    minWeft: 60,
  },
  {
    application: "Industrial Canvas",
    minDensity: 200,
    maxDensity: 400,
    minWarp: 120,
    minWeft: 100,
  },
  {
    application: "Lining / Pocketing",
    minDensity: 90,
    maxDensity: 160,
    minWarp: 50,
    minWeft: 45,
  },
] as const;

function inferWeaveType(warp: number, weft: number): string {
  const ratio = warp / Math.max(weft, 1);
  if (ratio >= 0.9 && ratio <= 1.15) return "Balanced Plain Weave";
  if (ratio > 1.15 && ratio <= 1.5) return "Warp-Dominant (Twill-like)";
  if (ratio > 1.5) return "Heavy Warp-Faced";
  if (ratio < 0.85) return "Weft-Dominant (Satin-like)";
  return "Plain Weave";
}

function estimateGsm(
  warp: number,
  weft: number,
  density: number,
  fabricType: string
): number {
  const base = (warp + weft) * 1.35 + density * 0.6;
  const type = fabricType.toLowerCase();
  let modifier = 1;
  if (type.includes("denim") || type.includes("canvas")) modifier = 1.4;
  else if (type.includes("silk") || type.includes("chiffon")) modifier = 0.65;
  else if (type.includes("polyester") || type.includes("blend")) modifier = 0.9;
  else if (type.includes("linen")) modifier = 1.15;
  return Math.round(base * modifier);
}

function computeCoverFactor(warp: number, weft: number): number {
  const total = warp + weft;
  return Math.round((total / Math.max(total + 20, 1)) * 100) / 100;
}

function matchStandards(
  warp: number,
  weft: number,
  density: number
): StandardMatch[] {
  return APPLICATION_STANDARDS.map((std) => {
    const densityOk = density >= std.minDensity && density <= std.maxDensity;
    const warpOk = warp >= std.minWarp;
    const weftOk = weft >= std.minWeft;
    const passCount = [densityOk, warpOk, weftOk].filter(Boolean).length;

    let status: StandardMatch["status"];
    let note: string;

    if (passCount === 3) {
      status = "pass";
      note = `Meets ${std.application} spec (${std.minDensity}–${std.maxDensity} threads/in)`;
    } else if (passCount === 2 || (densityOk && Math.abs(density - std.minDensity) < 15)) {
      status = "marginal";
      note = `Close to ${std.application} — verify with lab test`;
    } else {
      status = "fail";
      note = `Outside ${std.application} range`;
    }

    return { application: std.application, status, note };
  });
}

function deriveQualityGrade(
  confidence: number,
  density: number,
  ratio: number
): QualityGrade {
  const balance = Math.abs(ratio - 1);
  if (confidence >= 95 && density >= 80 && balance < 0.35) return "A";
  if (confidence >= 88 && density >= 50) return "B";
  return "C";
}

function deriveRecommendedUses(
  density: number,
  fabricType: string,
  gsm: number
): string[] {
  const uses: string[] = [];
  const type = fabricType.toLowerCase();

  if (density >= 180) uses.push("Bedding & Percale", "Fine Apparel");
  else if (density >= 120) uses.push("Shirting", "Casual Apparel", "Light Upholstery");
  else if (density >= 80) uses.push("Blouses", "Lining", "Pocketing");
  else uses.push("Denim", "Workwear", "Bagging");

  if (gsm >= 250) uses.push("Industrial Canvas", "Heavy-Duty Bags");
  if (type.includes("cotton")) uses.push("Breathable Summer Wear");
  if (type.includes("polyester") || type.includes("blend"))
    uses.push("Wrinkle-Resistant Uniforms");

  return [...new Set(uses)].slice(0, 5);
}

function deriveProcurementVerdict(
  grade: QualityGrade,
  confidence: number,
  standards: StandardMatch[]
): { verdict: ProcurementVerdict; summary: string } {
  const passCount = standards.filter((s) => s.status === "pass").length;

  if (grade === "A" && confidence >= 92 && passCount >= 2) {
    return {
      verdict: "approve",
      summary:
        "Specs align with multiple industry standards. Suitable for bulk procurement pending supplier COA.",
    };
  }
  if (grade === "C" || confidence < 85 || passCount === 0) {
    return {
      verdict: "reject",
      summary:
        "Does not meet minimum quality thresholds. Request lab verification before purchase.",
    };
  }
  return {
    verdict: "review",
    summary:
      "Acceptable for sampling. Order a strike-off and request GSM + shrinkage test before bulk buy.",
  };
}

function deriveShrinkageRisk(density: number, fabricType: string): RiskLevel {
  const type = fabricType.toLowerCase();
  if (type.includes("cotton") && density < 100) return "high";
  if (type.includes("pre-shrunk") || type.includes("polyester")) return "low";
  if (density >= 140) return "low";
  if (density >= 100) return "medium";
  return "high";
}

function deriveDurabilityScore(
  density: number,
  gsm: number,
  ratio: number
): number {
  const densityScore = Math.min(density / 30, 4);
  const gsmScore = Math.min(gsm / 60, 3);
  const balanceScore = ratio > 0.7 && ratio < 1.6 ? 3 : 1.5;
  return Math.min(10, Math.round(densityScore + gsmScore + balanceScore));
}

function buildSupplierChecklist(
  insight: Omit<FabricProcurementInsight, "supplierChecklist">
): string[] {
  const checklist = [
    "Request Certificate of Analysis (COA) from supplier",
    `Confirm declared GSM matches estimated ${insight.estimatedGsm} g/m² (±5%)`,
    "Verify lot number and batch dye consistency",
    "Request shrinkage test report (AATCC 135)",
  ];

  if (insight.shrinkageRisk === "high") {
    checklist.push("Mandatory pre-wash / sanforization certificate");
  }
  if (insight.procurementVerdict === "review") {
    checklist.push("Order 1-yard strike-off before bulk commitment");
    checklist.push("Compare against approved golden sample");
  }
  if (insight.qualityGrade !== "A") {
    checklist.push("Third-party lab verification recommended");
  }

  return checklist;
}

export function generateProcurementInsight(
  results: FabricAnalysisResult
): FabricProcurementInsight {
  const { warpCount, weftCount, threadDensity, fabricType, confidence } = results;
  const warpWeftRatio = Math.round((warpCount / Math.max(weftCount, 1)) * 100) / 100;
  const estimatedGsm = estimateGsm(warpCount, weftCount, threadDensity, fabricType);
  const weaveType = inferWeaveType(warpCount, weftCount);
  const standardsMatch = matchStandards(warpCount, weftCount, threadDensity);
  const qualityGrade = deriveQualityGrade(confidence, threadDensity, warpWeftRatio);
  const recommendedUses = deriveRecommendedUses(threadDensity, fabricType, estimatedGsm);
  const { verdict: procurementVerdict, summary: verdictSummary } =
    deriveProcurementVerdict(qualityGrade, confidence, standardsMatch);
  const shrinkageRisk = deriveShrinkageRisk(threadDensity, fabricType);
  const durabilityScore = deriveDurabilityScore(threadDensity, estimatedGsm, warpWeftRatio);
  const coverFactor = computeCoverFactor(warpCount, weftCount);

  const bestMatch = standardsMatch
    .filter((s) => s.status === "pass")
    .map((s) => s.application)[0]
    ?? standardsMatch.find((s) => s.status === "marginal")?.application
    ?? "General Purpose Textile";

  const base: FabricProcurementInsight = {
    estimatedGsm,
    weaveType,
    warpWeftRatio,
    qualityGrade,
    recommendedUses,
    standardsMatch,
    procurementVerdict,
    verdictSummary,
    supplierChecklist: [],
    shrinkageRisk,
    durabilityScore,
    coverFactor,
    bestMatchedApplication: bestMatch,
  };

  return {
    ...base,
    supplierChecklist: buildSupplierChecklist(base),
  };
}

export function compareFabrics(
  a: FabricAnalysisResult,
  b: FabricAnalysisResult
): {
  winner: "a" | "b" | "tie";
  summary: string;
  metrics: {
    label: string;
    aValue: string;
    bValue: string;
    winner: "a" | "b" | "tie";
  }[];
} {
  const procA = generateProcurementInsight(a);
  const procB = generateProcurementInsight(b);

  const metrics = [
    {
      label: "Thread Density",
      aValue: `${a.threadDensity}/in`,
      bValue: `${b.threadDensity}/in`,
      winner: (a.threadDensity > b.threadDensity ? "a" : a.threadDensity < b.threadDensity ? "b" : "tie") as "a" | "b" | "tie",
    },
    {
      label: "Est. GSM",
      aValue: `${procA.estimatedGsm} g/m²`,
      bValue: `${procB.estimatedGsm} g/m²`,
      winner: (procA.estimatedGsm > procB.estimatedGsm ? "a" : procA.estimatedGsm < procB.estimatedGsm ? "b" : "tie") as "a" | "b" | "tie",
    },
    {
      label: "Quality Grade",
      aValue: procA.qualityGrade,
      bValue: procB.qualityGrade,
      winner: (procA.qualityGrade < procB.qualityGrade ? "a" : procA.qualityGrade > procB.qualityGrade ? "b" : "tie") as "a" | "b" | "tie",
    },
    {
      label: "Durability",
      aValue: `${procA.durabilityScore}/10`,
      bValue: `${procB.durabilityScore}/10`,
      winner: (procA.durabilityScore > procB.durabilityScore ? "a" : procA.durabilityScore < procB.durabilityScore ? "b" : "tie") as "a" | "b" | "tie",
    },
    {
      label: "AI Confidence",
      aValue: `${a.confidence.toFixed(1)}%`,
      bValue: `${b.confidence.toFixed(1)}%`,
      winner: (a.confidence > b.confidence ? "a" : a.confidence < b.confidence ? "b" : "tie") as "a" | "b" | "tie",
    },
    {
      label: "Procurement",
      aValue: procA.procurementVerdict,
      bValue: procB.procurementVerdict,
      winner: (procA.procurementVerdict === "approve" && procB.procurementVerdict !== "approve" ? "a" : procB.procurementVerdict === "approve" && procA.procurementVerdict !== "approve" ? "b" : "tie") as "a" | "b" | "tie",
    },
  ];

  const aWins = metrics.filter((m) => m.winner === "a").length;
  const bWins = metrics.filter((m) => m.winner === "b").length;

  let winner: "a" | "b" | "tie" = "tie";
  let summary = "Both fabrics are comparable — choose based on end-use requirements.";

  if (aWins > bWins) {
    winner = "a";
    summary = `Fabric A wins on ${aWins} of ${metrics.length} procurement metrics. Recommended for bulk purchase.`;
  } else if (bWins > aWins) {
    winner = "b";
    summary = `Fabric B wins on ${bWins} of ${metrics.length} procurement metrics. Recommended for bulk purchase.`;
  }

  return { winner, summary, metrics };
}
