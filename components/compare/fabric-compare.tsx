"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { analyzeFabricAction } from "@/actions/analysis";
import { compareFabrics } from "@/services/textile-engineering";
import type { AnalysisRecord, FabricAnalysisResult } from "@/lib/types/analysis";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Scale, Trophy } from "lucide-react";

interface FabricCompareProps {
  analyses: AnalysisRecord[];
}

function recordToResult(record: AnalysisRecord): FabricAnalysisResult | null {
  if (
    record.warpCount == null ||
    record.weftCount == null ||
    record.threadDensity == null
  ) {
    return null;
  }
  return {
    fabricType: record.fabricType ?? "Unknown Fabric",
    threadDensity: record.threadDensity,
    warpCount: record.warpCount,
    weftCount: record.weftCount,
    confidence: record.confidence ?? 90,
  };
}

export function FabricCompare({ analyses }: FabricCompareProps) {
  const [fabricAId, setFabricAId] = useState(analyses[0]?.id ?? "");
  const [fabricBId, setFabricBId] = useState(analyses[1]?.id ?? "");
  const [isPending, startTransition] = useTransition();
  const [comparison, setComparison] = useState<ReturnType<typeof compareFabrics> | null>(null);
  const [resultA, setResultA] = useState<FabricAnalysisResult | null>(null);
  const [resultB, setResultB] = useState<FabricAnalysisResult | null>(null);

  const fabricA = analyses.find((a) => a.id === fabricAId);
  const fabricB = analyses.find((a) => a.id === fabricBId);

  const runCompare = () => {
    if (!fabricA || !fabricB) {
      toast.error("Select two fabrics to compare");
      return;
    }
    if (fabricAId === fabricBId) {
      toast.error("Select two different fabrics");
      return;
    }

    startTransition(async () => {
      let resA = recordToResult(fabricA);
      let resB = recordToResult(fabricB);

      if (!resA) {
        toast.info("Analyzing Fabric A...");
        const out = await analyzeFabricAction({
          imageUrl: fabricA.imageUrl,
          fileName: fabricA.fileName,
          analysisId: fabricA.id,
        });
        if (!out.success) {
          toast.error("Failed to analyze Fabric A", { description: out.error });
          return;
        }
        resA = out.data.results;
      }

      if (!resB) {
        toast.info("Analyzing Fabric B...");
        const out = await analyzeFabricAction({
          imageUrl: fabricB.imageUrl,
          fileName: fabricB.fileName,
          analysisId: fabricB.id,
        });
        if (!out.success) {
          toast.error("Failed to analyze Fabric B", { description: out.error });
          return;
        }
        resB = out.data.results;
      }

      setResultA(resA);
      setResultB(resB);
      setComparison(compareFabrics(resA, resB));
      toast.success("Comparison ready");
    });
  };

  if (analyses.length < 2) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Scale className="size-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Upload at least two fabric samples to compare suppliers side-by-side.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="interactive-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="size-5" />
            Select Fabrics to Compare
          </CardTitle>
          <CardDescription>
            Compare thread specs, GSM, and procurement verdicts — ideal for choosing between suppliers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fabric A (Supplier / Sample 1)</Label>
              <select
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                value={fabricAId}
                onChange={(e) => setFabricAId(e.target.value)}
              >
                {analyses.map((a) => (
                  <option key={a.id} value={a.id}>{a.fileName}</option>
                ))}
              </select>
              {fabricA && (
                <div className="aspect-video rounded-lg overflow-hidden bg-muted mt-2">
                  <img src={fabricA.imageUrl} alt={fabricA.fileName} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Fabric B (Supplier / Sample 2)</Label>
              <select
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                value={fabricBId}
                onChange={(e) => setFabricBId(e.target.value)}
              >
                {analyses.map((a) => (
                  <option key={a.id} value={a.id}>{a.fileName}</option>
                ))}
              </select>
              {fabricB && (
                <div className="aspect-video rounded-lg overflow-hidden bg-muted mt-2">
                  <img src={fabricB.imageUrl} alt={fabricB.fileName} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
          <Button onClick={runCompare} disabled={isPending} className="w-full sm:w-auto">
            {isPending ? "Analyzing & Comparing..." : "Compare for Procurement"}
          </Button>
        </CardContent>
      </Card>

      {comparison && resultA && resultB && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className={`border-2 interactive-card ${
            comparison.winner === "a" ? "border-primary/50" :
            comparison.winner === "b" ? "border-chart-3/50" : "border-border"
          }`}>
            <CardContent className="flex items-center gap-4 pt-6">
              <Trophy className="size-8 text-primary" />
              <div>
                <p className="font-bold text-lg">
                  {comparison.winner === "tie"
                    ? "Both fabrics are comparable"
                    : `Fabric ${comparison.winner.toUpperCase()} recommended for purchase`}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{comparison.summary}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="interactive-card overflow-hidden">
            <CardHeader>
              <CardTitle>Side-by-Side Metrics</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Metric</th>
                    <th className="text-center p-4 font-medium">Fabric A</th>
                    <th className="text-center p-4 font-medium">Fabric B</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 text-muted-foreground">Fabric Type</td>
                    <td className={`p-4 text-center ${comparison.winner === "a" ? "font-bold text-primary" : ""}`}>
                      {resultA.fabricType}
                    </td>
                    <td className={`p-4 text-center ${comparison.winner === "b" ? "font-bold text-primary" : ""}`}>
                      {resultB.fabricType}
                    </td>
                  </tr>
                  {comparison.metrics.map((row) => (
                    <tr key={row.label} className="border-b last:border-0">
                      <td className="p-4 text-muted-foreground">{row.label}</td>
                      <td className={`p-4 text-center ${
                        row.winner === "a" ? "font-bold text-emerald-500 bg-emerald-500/5" : ""
                      }`}>
                        {row.aValue}
                        {row.winner === "a" && " ✓"}
                      </td>
                      <td className={`p-4 text-center ${
                        row.winner === "b" ? "font-bold text-emerald-500 bg-emerald-500/5" : ""
                      }`}>
                        {row.bValue}
                        {row.winner === "b" && " ✓"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
