import Link from "next/link";
import { analyzeFabricAction } from "@/actions/analysis";
import { Button } from "@/components/ui/button";
import { AnalysisReportClient } from "./analysis-report-client";

export async function AnalysisReport({
  imageUrl,
  analysisId,
}: {
  imageUrl?: string;
  analysisId?: string;
}) {
  if (!imageUrl) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-destructive font-medium">No image URL provided</p>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const result = await analyzeFabricAction({
    imageUrl,
    analysisId,
  });

  if (!result.success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-destructive font-medium">{result.error}</p>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  if (!result.data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-destructive font-medium">Analysis data is missing</p>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const { results, procurement } = result.data;

  return (
    <AnalysisReportClient
      results={results}
      procurement={procurement}
      imageUrl={imageUrl}
    />
  );
}
