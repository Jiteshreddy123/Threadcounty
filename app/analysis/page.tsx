import { Suspense } from "react";
import { AnalysisReport } from "@/components/analysis/analysis-report";
import { Skeleton } from "@/components/ui/skeleton";

function AnalysisSkeleton() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 p-8">
      <Skeleton className="w-16 h-16 rounded-full" />
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-48" />
    </div>
  );
}

export default async function AnalysisPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const imageUrl = typeof searchParams.image === 'string' ? searchParams.image : undefined;
  const analysisId = typeof searchParams.id === 'string' ? searchParams.id : undefined;

  return (
    <div className="min-h-screen p-8 print:bg-white print:p-4 print:text-sm">
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<AnalysisSkeleton />}>
          <AnalysisReport imageUrl={imageUrl} analysisId={analysisId} />
        </Suspense>
      </div>
    </div>
  );
}
