"use client";

import { Inter } from "next/font/google";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground flex items-center justify-center min-h-screen`}>
        <div className="space-y-4 text-center p-8 max-w-md mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Critical Error</h2>
          <p className="text-muted-foreground">
            A critical error occurred while rendering the application. We apologize for the inconvenience.
          </p>
          <Button onClick={() => reset()} variant="default">
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
