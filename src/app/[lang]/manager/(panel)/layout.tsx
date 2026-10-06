import React from 'react';
import ManagerShell from '@/components/Manager/ManagerShell';

export default async function ManagerPanelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <ManagerShell lang={lang}>{children}</ManagerShell>;
}
