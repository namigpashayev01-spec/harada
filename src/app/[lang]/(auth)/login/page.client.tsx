"use client";
import React from "react";
import { useParams } from "next/navigation";
import { UtensilsCrossed } from "lucide-react";
import BGImage from "@/assets/images/restaurant-image.jpg";
import LoginForm from "@/components/Login/LoginForm";

const BANNER: Record<string, { welcome: string; tagline: string }> = {
  az: {
    welcome: "Yenidən xoş gəldiniz",
    tagline:
      "Hesabınıza daxil olun və sevimli restoranlarınızı bir yerdə idarə edin.",
  },
  en: {
    welcome: "Welcome back",
    tagline:
      "Sign in to your account and manage your favorite restaurants in one place.",
  },
  ru: {
    welcome: "С возвращением",
    tagline:
      "Войдите в аккаунт и управляйте любимыми ресторанами в одном месте.",
  },
};

export default function LoginPageClient() {
  const { lang } = useParams<{ lang: string }>();
  const b = BANNER[lang] ?? BANNER.az;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-[#013a30] via-[#006653] to-[#0a7d54]">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Branded banner */}
        <div className="relative hidden lg:block">
          {/* Use regular img tag for static export */}
          <img
            src={BGImage.src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#013a30]/85 via-[#006653]/70 to-[#0a7d54]/55" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center p-10 text-center text-white">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#9fe870] shadow-xl ring-4 ring-white/20">
              <UtensilsCrossed className="h-8 w-8 text-[#14532d]" />
            </span>
            <h2 className="mt-6 text-3xl font-bold leading-tight">
              {b.welcome}
            </h2>
            <span className="mt-4 block h-1 w-12 rounded-full bg-[#9fe870]" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/85">
              {b.tagline}
            </p>
          </div>
        </div>

        {/* Login form */}
        <div className="p-8 sm:p-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
