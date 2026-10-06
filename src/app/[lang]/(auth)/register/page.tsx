import type { Metadata } from "next";
import React from "react";
import RegisterPageClient from "./page.client";
import { t } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: { absolute: t(lang, "seo.register.title") },
    description: t(lang, "seo.register.description"),
    robots: { index: false, follow: false },
  };
}

export default function page() {
  return <RegisterPageClient />;
}
