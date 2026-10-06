import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: { absolute: 'Restoran paneli' },
  // Panel axtarış nəticələrində görünməməlidir
  robots: { index: false, follow: false },
};

export default function ManagerRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
