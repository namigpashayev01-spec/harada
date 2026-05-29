import React from "react";
import AuthGuard from "@/components/Dashboard/AuthGuard";
import DashboardShell from "@/components/Dashboard/DashboardShell";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { lang } = await params;

  return (
    <DashboardShell lang={lang}>
      <AuthGuard>{children}</AuthGuard>
    </DashboardShell>
  );
}
