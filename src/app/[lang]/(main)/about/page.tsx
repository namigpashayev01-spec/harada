import AboutContent from '@/components/About/AboutContent';

interface AboutPageProps {
  params: Promise<{ lang: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang } = await params;
  return (
    <div>
      <AboutContent lang={lang} />
    </div>
  );
}
