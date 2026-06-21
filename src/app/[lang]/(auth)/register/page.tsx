import type { Metadata } from "next";
import React from "react";
import RegisterPageClient from "./page.client";

export const metadata: Metadata = {
  title: { absolute: "Qeydiyyat — Harada Oturaq" },
  description:
    "Harada Oturaq-da pulsuz hesab yarat, restoranları kəşf et, rezervasiya et və sevimlilərini saxla.",
  robots: { index: false, follow: false },
};

export default function page() {
  return <RegisterPageClient />;
}
