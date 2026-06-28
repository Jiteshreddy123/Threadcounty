import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserProfile } from "@/lib/types/analysis";

export async function getCurrentUser(supabase: SupabaseClient) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  return user;
}

export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116" || error.code === "42P01") {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      return {
        id: user.id,
        fullName: (user.user_metadata?.full_name as string) ?? null,
        email: user.email ?? null,
        updatedAt: null,
      };
    }
    throw new Error(error.message);
  }

  return {
    id: data.id,
    fullName: data.full_name,
    email: data.email,
    updatedAt: data.updated_at,
  };
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  fullName: string
): Promise<UserProfile> {
  const { data: { user } } = await supabase.auth.getUser();

  const { error: authError } = await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  if (authError) throw new Error(authError.message);

  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      id: userId,
      full_name: fullName,
      email: user?.email ?? null,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    if (error.code === "42P01") {
      return {
        id: userId,
        fullName,
        email: user?.email ?? null,
        updatedAt: new Date().toISOString(),
      };
    }
    throw new Error(error.message);
  }

  return {
    id: data.id,
    fullName: data.full_name,
    email: data.email,
    updatedAt: data.updated_at,
  };
}
