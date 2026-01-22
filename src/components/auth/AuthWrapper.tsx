"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, initialized, checkAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!initialized) {
      checkAuth();
    }
  }, [initialized, checkAuth]);

  useEffect(() => {
    if (initialized && !loading) {
      const isPublicPath = pathname === "/login" || pathname === "/register";

      if (!user && !isPublicPath) {
        router.push("/login");
      }

      if (user && isPublicPath) {
        router.push("/");
      }
    }
  }, [user, loading, initialized, pathname, router]);

  const isPublicPath = pathname === "/login" || pathname === "/register";

  if (loading || !initialized) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-primary-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  // Robust protection: If we are on a protected path and have no user,
  // do NOT render the children, even if loading is false.
  // This prevents the "flash" of protected content.
  if (!user && !isPublicPath) {
    return null; // Or return a specific "Redirecting..." UI
  }

  // If we have a user and are on an auth page, we are about to redirect to "/"
  // Block rendering to prevent "flash" of login page
  if (user && isPublicPath) {
    return null;
  }

  return <>{children}</>;
}
