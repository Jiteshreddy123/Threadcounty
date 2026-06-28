"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { uploadFabricAction } from "@/actions/upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type UploadState = {
  status: "idle" | "compressing" | "uploading" | "success";
  message: string;
};

export function FabricUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [uploadState, setUploadState] = useState<UploadState>({ status: "idle", message: "" });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File too large", { description: "Please select an image under 5MB." });
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) return;

    startTransition(async () => {
      try {
        setUploadState({ status: "compressing", message: "Compressing image..." });

        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });

        setUploadState({ status: "uploading", message: "Uploading to cloud..." });

        const formData = new FormData();
        formData.append("file", compressedFile, compressedFile.name);

        const result = await uploadFabricAction(formData);

        if (!result.success) {
          toast.error("Upload failed", { description: result.error || "An unknown error occurred." });
          setUploadState({ status: "idle", message: "" });
          return;
        }

        if (!result.data) {
          toast.error("Upload failed", { description: "Missing data from server." });
          setUploadState({ status: "idle", message: "" });
          return;
        }

        setUploadState({ status: "success", message: "Upload complete! Starting analysis..." });
        toast.success("Image uploaded", { description: "Redirecting to AI analysis..." });

        const params = new URLSearchParams({
          image: result.data.publicUrl,
        });
        if (result.data.analysisId) {
          params.set("id", result.data.analysisId);
        }

        router.push(`/analysis?${params.toString()}`);
      } catch (error) {
        toast.error("Upload failed", { description: error instanceof Error ? error.message : "An error occurred during upload." });
        setUploadState({ status: "idle", message: "" });
      }
    });
  };

  const isUploading = isPending || uploadState.status !== "idle";

  return (
    <Card className="interactive-card">
      <CardHeader>
        <CardTitle>New Analysis</CardTitle>
        <CardDescription>
          Upload a clear, well-lit image of your fabric (JPG, JPEG, PNG). Max size 5MB.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fabric-image">Select Fabric Image</Label>
          <Input
            id="fabric-image"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>

        {uploadState.message && (
          <p className="text-sm font-medium text-primary animate-pulse">
            {uploadState.message}
          </p>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="w-full sm:w-auto"
        >
          {isUploading ? "Processing..." : "Upload and Analyze"}
        </Button>
      </CardContent>
    </Card>
  );
}
