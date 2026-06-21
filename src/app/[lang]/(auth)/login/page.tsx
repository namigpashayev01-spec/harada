import type { Metadata } from "next";
import React from "react";
import LoginPageClient from "./page.client";

export const metadata: Metadata = {
  title: { absolute: "Daxil ol — Harada Oturaq" },
  description:
    "Harada Oturaq hesabına daxil ol, sevimli restoranlarını və rezervasiyalarını idarə et.",
  robots: { index: false, follow: false },
};

export default function page() {
  return <LoginPageClient />;
}
