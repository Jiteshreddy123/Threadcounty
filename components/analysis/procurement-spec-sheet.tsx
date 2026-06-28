import type {
  FabricProcurementInsight,
  ProcurementVerdict,
  QualityGrade,
  RiskLevel,
} from "@/lib/types/analysis";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, XCircle, ClipboardList } from "lucide-react";

const VERDICT_STYLES: Record<
  ProcurementVerdict,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  approve: {
    label: "Approve for Purchase",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    icon: CheckCircle2,
  },
  review: {
    label: "Review Before Buying",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    icon: AlertTriangle,
  },
  reject: {
    label: "Do Not Purchase",
    className: "bg-destructive/10 text-destructive border-destructive/30",
    icon: XCircle,
  },
};

const GRADE_COLORS: Record<QualityGrade, string> = {
  A: "text-emerald-500",
  B: "text-amber-500",
  C: "text-destructive",
};

const RISK_LABELS: Record<RiskLevel, string> = {
  low: "Low shrinkage risk",
  medium: "Moderate — pre-wash recommended",
  high: "High — sanforization required",
};

interface ProcurementSpecSheetProps {
  procurement: FabricProcurementInsight;
}

export function ProcurementSpecSheet({ procurement }: ProcurementSpecSheetProps) {
  const verdict = VERDICT_STYLES[procurement.procurementVerdict];
  const VerdictIcon = verdict.icon;

  return (
    <div className="space-y-6">
      {/* Verdict banner */}
      <Card className={`border-2 ${verdict.className} interactive-card`}>
        <CardContent className="flex items-start gap-4 pt-6">
          <VerdictIcon className="size-8 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-lg">{verdict.label}</p>
            <p className="text-sm mt-1 opacity-90">{procurement.verdictSummary}</p>
            <p className="text-xs mt-2 opacity-70">
              Best match: {procurement.bestMatchedApplication}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Est. GSM", value: `${procurement.estimatedGsm} g/m²` },
          { label: "Weave Type", value: procurement.weaveType },
          { label: "Warp/Weft Ratio", value: String(procurement.warpWeftRatio) },
          { label: "Quality Grade", value: procurement.qualityGrade, grade: true },
          { label: "Cover Factor", value: String(procurement.coverFactor) },
          { label: "Durability", value: `${procurement.durabilityScore}/10` },
          { label: "Shrinkage Risk", value: RISK_LABELS[procurement.shrinkageRisk] },
        ].map((item) => (
          <Card key={item.label} className="interactive-card">
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
              <p className={`text-lg font-bold mt-1 ${item.grade ? GRADE_COLORS[procurement.qualityGrade] : ""}`}>
                {item.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Industry standards */}
        <Card className="interactive-card">
          <CardHeader>
            <CardTitle>Industry Standard Match</CardTitle>
            <CardDescription>How this fabric compares to common procurement specs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {procurement.standardsMatch.map((std) => (
              <div key={std.application} className="flex items-start gap-3 text-sm">
                <span className={`mt-0.5 size-2 rounded-full shrink-0 ${
                  std.status === "pass" ? "bg-emerald-500" :
                  std.status === "marginal" ? "bg-amber-500" : "bg-destructive"
                }`} />
                <div>
                  <p className="font-medium">{std.application}</p>
                  <p className="text-muted-foreground text-xs">{std.note}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommended uses + checklist */}
        <div className="space-y-6">
          <Card className="interactive-card">
            <CardHeader>
              <CardTitle>Recommended End-Uses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {procurement.recommendedUses.map((use) => (
                  <span
                    key={use}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    {use}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="interactive-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="size-4" />
                Supplier Verification Checklist
              </CardTitle>
              <CardDescription>Before placing a bulk order, confirm with your supplier</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {procurement.supplierChecklist.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">☐</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
