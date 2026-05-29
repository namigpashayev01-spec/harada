"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace(`/${lang || "en"}/login`);
    }
  }, [isAuthenticated, isInitializing, router, lang]);

  if (isInitializing || !isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#006653]" />
      </div>
    );
  }

  return <>{children}</>;
}
