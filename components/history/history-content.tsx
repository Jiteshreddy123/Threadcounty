import { getAnalyses } from "@/services/analyses";
import { createClient } from "@/lib/supabase/server";
import { HistoryGrid } from "@/components/history/history-grid";

export async function HistoryContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const analyses = await getAnalyses(supabase, user?.id);

  return <HistoryGrid initialAnalyses={analyses} />;
}
