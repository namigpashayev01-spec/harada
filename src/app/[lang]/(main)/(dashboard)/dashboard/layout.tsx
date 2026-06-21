import type { Metadata } from "next";
import React from "react";
import AuthGuard from "@/components/Dashboard/AuthGuard";
import DashboardShell from "@/components/Dashboard/DashboardShell";

export const metadata: Metadata = {
  title: { absolute: "Hesabım — Harada Oturaq" },
  description:
    "Şəxsi kabinet: rezervasiyalarını, sevimli restoranlarını və rəylərini idarə et.",
  robots: { index: false, follow: false },
};

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
