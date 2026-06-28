"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { changePasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle2, Lock } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    startTransition(async () => {
      const result = await changePasswordAction(newPassword);
      if (result.success) {
        setDone(true);
        toast.success("Password reset successfully!");
        setTimeout(() => router.push("/login"), 2500);
      } else {
        toast.error("Reset failed", { description: result.error });
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md interactive-card">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Lock className="size-5 text-primary" />
            <CardTitle className="text-2xl font-bold tracking-tight">Set new password</CardTitle>
          </div>
          <CardDescription>
            Choose a strong password of at least 8 characters.
          </CardDescription>
        </CardHeader>

        {done ? (
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2 className="size-12 text-primary" />
              <p className="font-semibold text-lg">Password updated!</p>
              <p className="text-sm text-muted-foreground">
                Redirecting you to the login page…
              </p>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isPending || !newPassword}>
                {isPending ? "Saving…" : "Reset Password"}
              </Button>
            </CardFooter>
          </form>
        )}

        <CardFooter className="justify-center">
          <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
