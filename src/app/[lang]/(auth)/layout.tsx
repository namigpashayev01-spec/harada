import type React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('')"
        }}
      />
      
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        {children}
      </div>
    </main>
  );
}
