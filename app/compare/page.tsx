import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAnalyses } from "@/services/analyses";
import { FabricCompare } from "@/components/compare/fabric-compare";

export default async function ComparePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/compare");
  }

  const analyses = await getAnalyses(supabase, user.id);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fabric Compare</h1>
          <p className="text-muted-foreground">
            Side-by-side procurement analysis — choose the best cloth between two suppliers or samples.
          </p>
        </div>
        <FabricCompare analyses={analyses} />
      </div>
    </div>
  );
}
