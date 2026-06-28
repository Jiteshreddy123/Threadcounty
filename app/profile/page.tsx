"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Lock, Trash2, Shield, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { fetchProfileAction, updateProfileAction } from "@/actions/profile";
import { changePasswordAction } from "@/actions/auth";
import type { UserProfile } from "@/lib/types/analysis";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isPasswordPending, startPasswordTransition] = useTransition();

  useEffect(() => {
    fetchProfileAction().then((result) => {
      if (result.success && result.data) {
        setProfile(result.data);
        setFullName(result.data.fullName ?? "");
      } else if (result.success && !result.data) {
        router.push("/login");
      }
    });
  }, [router]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateProfileAction(fullName);
      if (result.success) {
        setProfile(result.data);
        toast.success("Profile updated successfully");
      } else {
        toast.error("Update failed", { description: result.error });
      }
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    startPasswordTransition(async () => {
      const result = await changePasswordAction(newPassword);
      if (result.success) {
        toast.success("Password changed successfully");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error("Failed to change password", { description: result.error });
      }
    });
  };

  const handleDeleteAccount = () => {
    if (!confirm("Are you absolutely sure? This will permanently delete your account and all data. This cannot be undone.")) return;
    toast.error("Account deletion requires contacting support at support@threadcounty.com");
  };

  const initials = profile?.fullName
    ? profile.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : profile?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information and security.</p>
        </motion.div>

        {/* Avatar + Overview */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="interactive-card">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="size-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                    {initials}
                  </div>
                  <button
                    className="absolute -bottom-1 -right-1 size-7 rounded-full bg-muted border flex items-center justify-center hover:bg-muted/80 transition-colors"
                    title="Avatar upload coming soon"
                    onClick={() => toast.info("Profile photo upload coming soon!")}
                  >
                    <Camera className="size-3.5" />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-semibold">{profile?.fullName || "No name set"}</h2>
                  <p className="text-muted-foreground text-sm mt-0.5">{profile?.email}</p>
                  <div className="flex gap-2 mt-3 justify-center sm:justify-start flex-wrap">
                    <Badge variant="secondary">Free Plan</Badge>
                    <Badge variant="outline" className="text-xs">
                      Member since {profile?.updatedAt ? new Date(profile.updatedAt).getFullYear() : new Date().getFullYear()}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Update Profile */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="interactive-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="size-5 text-primary" />
                <CardTitle>Personal Information</CardTitle>
              </div>
              <CardDescription>Update your display name.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profile?.email ?? ""}
                    disabled
                    className="opacity-60"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed. Contact support if needed.</p>
                </div>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Change Password */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="interactive-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="size-5 text-primary" />
                <CardTitle>Change Password</CardTitle>
              </div>
              <CardDescription>Choose a strong password with at least 8 characters.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={8}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={8}
                  />
                </div>
                <Button type="submit" disabled={isPasswordPending || !newPassword}>
                  {isPasswordPending ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-destructive/40">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-destructive" />
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </div>
              <CardDescription>Irreversible account actions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-sm">Delete account</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Permanently delete your account and all associated data.</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2 shrink-0"
                >
                  <Trash2 className="size-3.5" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
