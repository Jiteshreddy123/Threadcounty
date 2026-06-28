import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "fabric_uploads";
const UPLOAD_PREFIX = "user_uploads";

export function getFabricPublicUrl(
  supabase: SupabaseClient,
  filePath: string
): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function uploadFabricImage(
  supabase: SupabaseClient,
  file: File | Blob,
  _userId?: string | null
): Promise<{ filePath: string; publicUrl: string; fileName: string }> {
  const fileExt = file instanceof File
    ? file.name.split(".").pop() || "jpg"
    : "jpg";
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  // Keep flat path — matches existing Supabase storage RLS policies
  const filePath = `${UPLOAD_PREFIX}/${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, { upsert: false });

  if (error) throw new Error(error.message);

  return {
    filePath,
    publicUrl: getFabricPublicUrl(supabase, filePath),
    fileName,
  };
}

export interface StorageFileItem {
  id: string;
  name: string;
  createdAt: string;
  imageUrl: string;
}

export async function listStorageFiles(
  supabase: SupabaseClient,
  _userId?: string | null
): Promise<StorageFileItem[]> {
  const folder = UPLOAD_PREFIX;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error) throw new Error(error.message);

  return (data ?? [])
    .filter((file) => file.name !== ".emptyFolderPlaceholder")
    .map((file) => ({
      id: file.id ?? file.name,
      name: file.name,
      createdAt: file.created_at ?? new Date().toISOString(),
      imageUrl: getFabricPublicUrl(supabase, `${folder}/${file.name}`),
    }));
}

export async function deleteStorageFiles(
  supabase: SupabaseClient,
  fileNames: string[]
): Promise<void> {
  const filePaths = fileNames.map((name) => `${UPLOAD_PREFIX}/${name}`);
  const { error } = await supabase.storage.from(BUCKET).remove(filePaths);
  if (error) throw new Error(error.message);
}
