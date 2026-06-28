import { getProfile } from "@/services/auth";
import { createClient } from "@/lib/supabase/server";
import { ProfileSettings } from "@/components/dashboard/profile-settings";

export async function DashboardProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const profile = user ? await getProfile(supabase, user.id) : null;
  return <ProfileSettings profile={profile} />;
}
