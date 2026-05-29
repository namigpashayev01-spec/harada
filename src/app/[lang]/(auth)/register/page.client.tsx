"use client";
import React from "react";
import BGImage from "@/assets/images/login_bg.png";
import RegisterForm from "@/components/Register/RegisterForm";

export default function RegisterPageClient() {
  return (
    <div className="relative w-full h-full min-h-screen min-w-screen bg-white">
      <img
        src={BGImage.src}
        alt="logo"
        className="w-[calc(100vw-32px)] h-[calc(100vh-32px)] object-cover absolute inset-0 top-0 left-4"
      />

      {/* Registration Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <RegisterForm />
      </div>
    </div>
  );
}