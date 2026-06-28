"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Share2, Lightbulb, CheckCircle2 } from "lucide-react";
import type { FabricAnalysisResult, FabricProcurementInsight } from "@/lib/types/analysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProcurementSpecSheet } from "@/components/analysis/procurement-spec-sheet";
import { ProcurementCalculator } from "@/components/analysis/procurement-calculator";
import { toast } from "sonner";

interface Props {
  results: FabricAnalysisResult;
  procurement: FabricProcurementInsight;
  imageUrl: string;
}

function generateAISuggestions(results: FabricAnalysisResult, procurement: FabricProcurementInsight): string[] {
  const suggestions: string[] = [];
  const { threadDensity, warpCount, weftCount, confidence } = results;

  if (threadDensity >= 150) {
    suggestions.push("High thread density detected — this fabric is excellent for premium bedding or high-end apparel where softness and durability are paramount.");
  } else if (threadDensity < 60) {
    suggestions.push("Lower thread density — ideal for breathable summer garments, but may require reinforcement at seams for durability.");
  } else {
    suggestions.push("Moderate thread density suitable for a wide range of applications including casual wear, upholstery, and home textiles.");
  }

  const ratio = warpCount / Math.max(weftCount, 1);
  if (ratio > 1.5) {
    suggestions.push("High warp-to-weft ratio suggests this is a warp-dominant weave. Expect strong lengthwise tensile strength, making it suitable for bags and straps.");
  } else if (ratio < 0.7) {
    suggestions.push("Weft-dominant structure observed. Fabric will have more stretch in the horizontal direction — consider this for stretch panels in garments.");
  } else {
    suggestions.push("Balanced warp/weft ratio indicates a plain or balanced weave — stable, predictable, and versatile for most textile applications.");
  }

  if (procurement.qualityGrade === "A") {
    suggestions.push("Grade A quality — this fabric meets premium standards. Suitable for luxury segments or direct buyer presentation without pre-washing.");
  } else if (procurement.qualityGrade === "B") {
    suggestions.push("Grade B — consider requesting a larger sample set from the supplier and specify tighter tolerances in your purchase order.");
  } else {
    suggestions.push("Grade C detected — recommend declining bulk order and requesting updated samples. Consider alternative suppliers for this spec.");
  }

  if (confidence < 85) {
    suggestions.push("Confidence below 85%: try re-uploading a higher resolution, macro-level photo with even lighting for a more accurate analysis.");
  }

  if (procurement.shrinkageRisk === "high") {
    suggestions.push("High shrinkage risk — factor in at least 8-10% shrinkage when calculating required yardage for production.");
  }

  return suggestions;
}

export function AnalysisReportClient({ results, procurement, imageUrl }: Props) {
  const handleNativeDownload = () => window.print();

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "ThreadCounty Analysis Report", url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied!", { description: "Share this URL to give others access to this report." });
      }
    } catch {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const suggestions = generateAISuggestions(results, procurement);

  return (
    <div className="space-y-8 print:space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analysis Report</h1>
          <p className="text-muted-foreground">
            AI analysis + textile engineering procurement spec sheet.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <Link href="/compare">
            <Button variant="outline">Compare with Another</Button>
          </Link>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="size-4 mr-2" /> Share Report
          </Button>
          <Button onClick={handleNativeDownload}>Download as PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2 print:gap-4">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="interactive-card print:shadow-none print:break-inside-avoid">
            <CardHeader className="print:pb-2">
              <CardTitle>Uploaded Fabric</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted rounded-md overflow-hidden print:h-48 print:aspect-auto">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Uploaded Fabric"
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <span className="text-muted-foreground">No image found</span>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="interactive-card print:shadow-none print:break-inside-avoid">
            <CardHeader className="print:pb-2">
              <CardTitle>Thread Analysis</CardTitle>
              <CardDescription>
                {results.confidence.toFixed(1)}% confidence · Grade {procurement.qualityGrade}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 print:space-y-2">
              {[
                ["Fabric Type", results.fabricType],
                ["Thread Density", `${results.threadDensity} threads/inch`],
                ["Warp Count (EPI)", String(results.warpCount)],
                ["Weft Count (PPI)", String(results.weftCount)],
                ["Est. GSM", `${procurement.estimatedGsm} g/m²`],
                ["Weave", procurement.weaveType],
              ].map(([label, value], i, arr) => (
                <div
                  key={label}
                  className={`flex justify-between ${i < arr.length - 1 ? "border-b pb-2" : "pb-2"}`}
                >
                  <span className="font-medium">{label}:</span>
                  <span className="text-muted-foreground text-right">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-xl font-bold tracking-tight">Procurement Spec Sheet</h2>
        <ProcurementSpecSheet procurement={procurement} />
        <ProcurementCalculator estimatedGsm={procurement.estimatedGsm} />
      </motion.div>

      {/* AI Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="interactive-card border-primary/20 print:shadow-none">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="size-5 text-primary" />
              <CardTitle>AI Suggestions</CardTitle>
            </div>
            <CardDescription>Actionable insights generated from your fabric analysis data.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {suggestions.map((suggestion, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="size-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{suggestion}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex justify-center print:hidden">
        <Link href="/dashboard">
          <Button variant="link">← Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
