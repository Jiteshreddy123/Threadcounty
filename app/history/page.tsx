import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HistoryContent } from "@/components/history/history-content";
import { HistorySkeleton } from "@/components/history/history-skeleton";

export default function HistoryPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analysis History</h1>
            <p className="text-muted-foreground">
              View all your previously uploaded fabric images. Updates in real-time.
            </p>
          </div>
          <Link href="/dashboard">
            <Button>+ New Upload</Button>
          </Link>
        </div>

        <Suspense fallback={<HistorySkeleton />}>
          <HistoryContent />
        </Suspense>
      </div>
    </div>
  );
}
