import type { Metadata } from "next";
import React from "react";
import LoginPageClient from "./page.client";
import { t } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: { absolute: t(lang, "seo.login.title") },
    description: t(lang, "seo.login.description"),
    robots: { index: false, follow: false },
  };
}

export default function page() {
  return <LoginPageClient />;
}
