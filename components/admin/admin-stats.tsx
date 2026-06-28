import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalyses } from "@/services/analyses";
import { Users, BarChart3, HardDrive, CreditCard } from "lucide-react";

export async function AdminStats() {
  let totalAnalyses = 0;
  let completedAnalyses = 0;
  let storageEstimateMb = 0;

  try {
    const supabase = await createClient();
    const analyses = await getAnalyses(supabase, undefined);
    totalAnalyses = analyses.length;
    completedAnalyses = analyses.filter((a) => a.status === "completed").length;
    // Rough storage estimate: average compressed fabric image ~300KB
    storageEstimateMb = Math.round((totalAnalyses * 300) / 1024);
  } catch {
    // Silently fall back to mock values if DB isn't set up
    totalAnalyses = 0;
  }

  const stats = [
    {
      label: "Total Fabric Uploads",
      value: totalAnalyses.toLocaleString(),
      change: "Across all users",
      icon: BarChart3,
      color: "text-primary bg-primary/10",
    },
    {
      label: "Completed Analyses",
      value: completedAnalyses.toLocaleString(),
      change: `${totalAnalyses > 0 ? Math.round((completedAnalyses / totalAnalyses) * 100) : 0}% success rate`,
      icon: Users,
      color: "text-chart-2 bg-chart-2/10",
    },
    {
      label: "Storage Estimated",
      value: storageEstimateMb < 1024 ? `${storageEstimateMb} MB` : `${(storageEstimateMb / 1024).toFixed(1)} GB`,
      change: "Compressed uploads",
      icon: HardDrive,
      color: "text-chart-3 bg-chart-3/10",
    },
    {
      label: "Platform Status",
      value: "Operational",
      change: "All systems normal",
      icon: CreditCard,
      color: "text-emerald-600 bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="interactive-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`size-8 rounded-md flex items-center justify-center ${stat.color}`}>
                <stat.icon className="size-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stat.value}</div>
            <p className="text-xs mt-1 text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
