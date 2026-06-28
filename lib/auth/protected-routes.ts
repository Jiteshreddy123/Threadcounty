export const PROTECTED_ROUTES = [
  "/dashboard",
  "/history",
  "/analysis",
  "/compare",
  "/admin",
  "/profile",
  "/reset-password",
] as const;

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}
