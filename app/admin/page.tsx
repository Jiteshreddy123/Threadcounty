import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAnalyses } from "@/services/analyses";
import { AdminStats } from "@/components/admin/admin-stats";
import { AdminCharts } from "@/components/admin/admin-charts";
import { AdminSkeleton } from "@/components/admin/admin-skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileImage, Mail } from "lucide-react";

async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch recent uploads (all users)
  let recentUploads: {
    id: string;
    imageUrl: string;
    fileName: string;
    status: string;
    createdAt: string;
    fabricType: string | null;
  }[] = [];

  try {
    const all = await getAnalyses(supabase, undefined);
    recentUploads = all.slice(0, 10).map((a) => ({
      id: a.id,
      imageUrl: a.imageUrl,
      fileName: a.fileName,
      status: a.status,
      createdAt: a.createdAt,
      fabricType: a.fabricType,
    }));
  } catch {
    recentUploads = [];
  }

  return (
    <div className="space-y-8">
      <AdminStats />
      <AdminCharts />

      {/* Recent Uploads Table */}
      <Card className="interactive-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileImage className="size-5 text-primary" />
            <CardTitle>Recent Fabric Uploads</CardTitle>
          </div>
          <CardDescription>Latest images uploaded across all users</CardDescription>
        </CardHeader>
        <CardContent>
          {recentUploads.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No uploads yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="text-left pb-2 pr-4">Image</th>
                    <th className="text-left pb-2 pr-4">File Name</th>
                    <th className="text-left pb-2 pr-4">Fabric Type</th>
                    <th className="text-left pb-2 pr-4">Status</th>
                    <th className="text-left pb-2">Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUploads.map((upload) => (
                    <tr key={upload.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="size-10 rounded-md overflow-hidden bg-muted border shrink-0">
                          <img
                            src={upload.imageUrl}
                            alt={upload.fileName}
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                          />
                        </div>
                      </td>
                      <td className="py-3 pr-4 max-w-[200px]">
                        <Link
                          href={`/analysis?image=${encodeURIComponent(upload.imageUrl)}&id=${upload.id}`}
                          className="truncate block hover:text-primary transition-colors font-medium"
                        >
                          {upload.fileName}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {upload.fabricType ?? "—"}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge
                          variant={
                            upload.status === "completed" ? "default" :
                            upload.status === "processing" ? "secondary" : "destructive"
                          }
                          className="text-xs"
                        >
                          {upload.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-muted-foreground text-xs">
                        {new Date(upload.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Messages Note */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="size-5 text-primary" />
            <CardTitle>Contact Messages</CardTitle>
          </div>
          <CardDescription>
            Messages submitted via the /contact page are stored in the <code className="text-xs bg-muted px-1 rounded">contact_messages</code> Supabase table.
            Access them directly from your{" "}
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Supabase Dashboard → Table Editor
            </a>{" "}
            (requires service role).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Why not shown here?</p>
            Contact messages use a service-role-only RLS policy for security. They cannot be read from the client-side anon key. Use the Supabase Dashboard or a server-side admin API to view them.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="size-5 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
            </div>
            <p className="text-muted-foreground">
              Platform statistics, fabric uploads, and system health.
            </p>
          </div>
          <Badge variant="outline" className="text-primary border-primary/30">
            Admin Panel
          </Badge>
        </div>

        <Suspense fallback={<AdminSkeleton />}>
          <AdminDashboard />
        </Suspense>
      </div>
    </div>
  );
}

