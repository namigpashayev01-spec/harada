import type React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { VALID_LANGUAGES } from '../../../../middleware';

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const safeLang = VALID_LANGUAGES.includes(lang) ? lang : 'az';

  return (
    <main className="min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('')",
        }}
      />

      <div className="absolute inset-0 bg-black/20" />

      {/* Back to home */}
      <Link
        href={`/${safeLang}`}
        className="absolute left-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm backdrop-blur transition-colors hover:bg-white">
        <ArrowLeft className="h-4 w-4" />
        Ana səhifə
      </Link>

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        {children}
      </div>
    </main>
  );
}
