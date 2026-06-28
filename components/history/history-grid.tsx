"use client";

import { useEffect, useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { AnalysisRecord } from "@/lib/types/analysis";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { deleteAnalysisAction, deleteAllAnalysesAction } from "@/actions/history";

interface HistoryGridProps {
  initialAnalyses: AnalysisRecord[];
}

function mapRealtimeRow(row: Record<string, unknown>): AnalysisRecord {
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
    status: row.status as AnalysisRecord["status"],
    createdAt: row.created_at as string,
  };
}

function mergeAnalysis(
  state: AnalysisRecord[],
  newRecord: AnalysisRecord
): AnalysisRecord[] {
  const exists = state.some((a) => a.id === newRecord.id);
  if (exists) {
    return state.map((a) => (a.id === newRecord.id ? newRecord : a));
  }
  return [newRecord, ...state];
}

export function HistoryGrid({ initialAnalyses }: HistoryGridProps) {
  const [isPending, startTransition] = useTransition();
  const [analyses, setAnalyses] = useState(initialAnalyses);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    setAnalyses(initialAnalyses);
  }, [initialAnalyses]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("analyses-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "analyses" },
        (payload) => {
          const record = mapRealtimeRow(payload.new as Record<string, unknown>);
          startTransition(() => {
            setAnalyses((prev) => mergeAnalysis(prev, record));
          });
          if (record.status === "completed") {
            toast.success("New analysis ready", {
              description: `${record.fileName} has been analyzed.`,
            });
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "analyses" },
        (payload) => {
          const record = mapRealtimeRow(payload.new as Record<string, unknown>);
          startTransition(() => {
            setAnalyses((prev) => mergeAnalysis(prev, record));
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = (id: string, fileName: string) => {
    startTransition(async () => {
      const result = await deleteAnalysisAction(id, fileName);
      if (result.success) {
        setAnalyses((prev) => prev.filter((a) => a.id !== id));
        toast.success("Analysis deleted");
      } else {
        toast.error("Failed to delete", { description: result.error });
      }
    });
  };

  const handleClearAll = () => {
    if (!confirm("Are you sure you want to clear all history? This cannot be undone.")) return;
    
    startTransition(async () => {
      const result = await deleteAllAnalysesAction();
      if (result.success) {
        setAnalyses([]);
        toast.success("History cleared");
      } else {
        toast.error("Failed to clear history", { description: result.error });
      }
    });
  };

  const filteredAnalyses = useMemo(() => {
    return analyses.filter((a) => {
      const matchesSearch =
        a.fileName.toLowerCase().includes(search.toLowerCase()) ||
        (a.fabricType ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [analyses, search, statusFilter]);

  if (analyses.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-xl border border-dashed">
        <p className="text-muted-foreground">You haven&apos;t analyzed any fabrics yet.</p>
        <Link href="/dashboard" className="mt-4 inline-block">
          <Button variant="outline" size="sm">Upload your first fabric</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 w-full sm:max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or fabric type..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SlidersHorizontal className="size-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="destructive" size="sm" onClick={handleClearAll} disabled={isPending}>
          Clear History
        </Button>
      </div>

      {filteredAnalyses.length === 0 && (
        <div className="text-center py-10 bg-card rounded-xl border border-dashed">
          <p className="text-muted-foreground text-sm">No results match your search.</p>
          <button onClick={() => { setSearch(""); setStatusFilter("all"); }} className="mt-2 text-xs text-primary hover:underline">
            Clear filters
          </button>
        </div>
      )}
      <div
        className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 ${isPending ? "opacity-90" : ""}`}
      >
      {filteredAnalyses.map((analysis, index) => (
        <motion.div
          key={analysis.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.35 }}
        >
          <Card className="overflow-hidden flex flex-col interactive-card">
            <CardHeader className="p-0">
              <div className="aspect-square bg-muted relative">
                <img
                  src={analysis.imageUrl}
                  alt={analysis.fileName}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
                {analysis.status === "processing" && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-1">
              <CardTitle className="text-sm truncate">{analysis.fileName}</CardTitle>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(analysis.createdAt).toLocaleDateString()}
              </p>
              {analysis.fabricType && (
                <p className="text-xs text-primary mt-1 truncate">{analysis.fabricType}</p>
              )}
            </CardContent>
              <CardFooter className="p-4 border-t flex flex-col gap-2">
                <Link
                  href={`/analysis?image=${encodeURIComponent(analysis.imageUrl)}&id=${analysis.id}`}
                  className="w-full"
                >
                  <Button variant="secondary" className="w-full text-xs">
                    {analysis.status === "completed" ? "View Report" : "View Status"}
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  className="w-full text-xs" 
                  onClick={() => handleDelete(analysis.id, analysis.fileName)}
                  disabled={isPending}
                >
                  Delete
                </Button>
              </CardFooter>
          </Card>
        </motion.div>
      ))}
      </div>
    </div>
  );
}
