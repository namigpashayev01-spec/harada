'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import SettingsForm from '@/components/Dashboard/SettingsForm';

const DICT: Record<string, { title: string; subtitle: string }> = {
  az: {
    title: 'Profil tənzimləmələri',
    subtitle: 'Profil məlumatlarınızı buradan yeniləyin',
  },
  en: {
    title: 'Profile Settings',
    subtitle: 'Update your profile information here',
  },
  ru: {
    title: 'Настройки профиля',
    subtitle: 'Обновите данные профиля здесь',
  },
};

export default function SettingsPageClient() {
  const { lang } = useParams<{ lang: string }>();
  const t = DICT[lang] ?? DICT.az;

  return (
    <div>
      <h1 className="text-[28px] font-bold text-[#006653]">{t.title}</h1>
      <p className="mt-1 mb-8 text-base text-[#475569]">{t.subtitle}</p>

      <SettingsForm />
    </div>
  );
}
