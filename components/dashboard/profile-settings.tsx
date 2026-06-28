"use client";

import { useOptimistic, useState, useTransition } from "react";
import { updateProfileAction } from "@/actions/profile";
import type { UserProfile } from "@/lib/types/analysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ProfileSettingsProps {
  profile: UserProfile | null;
}

export function ProfileSettings({ profile }: ProfileSettingsProps) {
  const [isPending, startTransition] = useTransition();
  const [fullName, setFullName] = useState(profile?.fullName ?? "");

  const [optimisticProfile, setOptimisticProfile] = useOptimistic(profile);

  const handleSave = () => {
    if (!fullName.trim()) {
      toast.error("Name required", { description: "Please enter your full name." });
      return;
    }

    startTransition(async () => {
      const optimistic: UserProfile = {
        id: profile?.id ?? "pending",
        fullName: fullName.trim(),
        email: profile?.email ?? null,
        updatedAt: new Date().toISOString(),
      };
      setOptimisticProfile(optimistic);

      const result = await updateProfileAction(fullName.trim());

      if (!result.success) {
        toast.error("Update failed", { description: result.error });
        return;
      }

      toast.success("Profile updated", { description: "Your changes have been saved." });
    });
  };

  return (
    <Card className="interactive-card">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Manage your account information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            disabled={isPending}
          />
        </div>
        {optimisticProfile?.email && (
          <div className="space-y-2">
            <Label>Email</Label>
            <p className="text-sm text-muted-foreground">{optimisticProfile.email}</p>
          </div>
        )}
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save Profile"}
        </Button>
      </CardContent>
    </Card>
  );
}
