import { redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAnalyses } from "@/services/analyses";
import { FabricUploader } from "@/components/dashboard/fabric-uploader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Upload, History, GitCompare, FileText, Activity, Clock, CheckCircle2, AlertCircle
} from "lucide-react";

async function DashboardContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/dashboard");

  const analyses = await getAnalyses(supabase, user.id);

  const totalUploads = analyses.length;
  const completed = analyses.filter((a) => a.status === "completed").length;
  const processing = analyses.filter((a) => a.status === "processing").length;
  const recentAnalyses = analyses.slice(0, 4);

  const displayName = (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "User";

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, <span className="text-primary">{displayName}</span> 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload a fabric image to get an instant AI-powered analysis report.
          </p>
        </div>
        <Badge variant="outline" className="text-xs shrink-0">
          <Activity className="size-3 mr-1 text-primary" />
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Uploads", value: totalUploads, icon: Upload, color: "text-primary bg-primary/10" },
          { label: "Completed", value: completed, icon: CheckCircle2, color: "text-chart-2 bg-chart-2/10" },
          { label: "Processing", value: processing, icon: Clock, color: "text-chart-3 bg-chart-3/10" },
          { label: "Failed", value: analyses.filter(a => a.status === "failed").length, icon: AlertCircle, color: "text-destructive bg-destructive/10" },
        ].map((stat) => (
          <Card key={stat.label} className="interactive-card">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`size-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="size-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload */}
        <div className="lg:col-span-2">
          <FabricUploader />
        </div>

        {/* Quick Actions */}
        <Card className="interactive-card">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription>Jump to common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { href: "/history", icon: History, label: "View History", desc: "Browse past analyses" },
              { href: "/compare", icon: GitCompare, label: "Compare Fabrics", desc: "Side-by-side analysis" },
              { href: "/profile", icon: FileText, label: "Edit Profile", desc: "Update account info" },
              { href: "/pricing", icon: Activity, label: "Upgrade Plan", desc: "Unlock more analyses" },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/60 transition-colors group cursor-pointer">
                  <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <action.icon className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Analyses */}
      {recentAnalyses.length > 0 && (
        <Card className="interactive-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Analyses</CardTitle>
              <CardDescription>Your latest fabric uploads</CardDescription>
            </div>
            <Link href="/history">
              <Button variant="ghost" size="sm" className="text-xs">View all →</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAnalyses.map((analysis) => (
                <Link
                  key={analysis.id}
                  href={`/analysis?image=${encodeURIComponent(analysis.imageUrl)}&id=${analysis.id}`}
                >
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="size-12 rounded-lg overflow-hidden bg-muted shrink-0 border">
                      <img
                        src={analysis.imageUrl}
                        alt={analysis.fileName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{analysis.fileName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                        {analysis.fabricType && ` · ${analysis.fabricType}`}
                      </p>
                    </div>
                    <Badge
                      variant={
                        analysis.status === "completed" ? "default" :
                        analysis.status === "processing" ? "secondary" : "destructive"
                      }
                      className="text-xs shrink-0"
                    >
                      {analysis.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="lg:col-span-2 h-52 rounded-xl" />
        <Skeleton className="h-52 rounded-xl" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </div>
  );
}
