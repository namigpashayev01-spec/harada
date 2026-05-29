'use client';
import React from 'react';
import SettingsForm from '@/components/Dashboard/SettingsForm';

export default function SettingsPageClient() {
  return (
    <div className="">
      {/* Title */}
      <h1 className="text-[28px] text-[#004225] mb-6">Profile Settings</h1>
      <div className="flex justify-between items-center gap-2 mb-8">
        <p className="text-base text-[#475569]">
          Please update your profile settings here
        </p>
      </div>

      {/* Settings Form Component */}
      <SettingsForm />
    </div>
  );
}
