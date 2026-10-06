import type { Metadata } from "next";
import React from "react";
import AuthGuard from "@/components/Dashboard/AuthGuard";
import DashboardShell from "@/components/Dashboard/DashboardShell";
import { t } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: { absolute: t(lang, "seo.dashboard.title") },
    description: t(lang, "seo.dashboard.description"),
    robots: { index: false, follow: false },
  };
}

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
