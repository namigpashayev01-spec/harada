import type { Metadata } from 'next';
import ContactForm from '@/components/Contact/ContactForm';
import ContactHero from '@/components/Contact/ContactHero';
import ContactInfo from '@/components/Contact/ContactInfo';
import { getContactDict } from '@/components/Contact/translations';
import { pageAlternates } from '@/lib/seo';

interface ContactPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: { absolute: 'Əlaqə — Bizimlə əlaqə saxla | Harada Oturaq' },
    description:
      'Sual, təklif və ya əməkdaşlıq üçün Harada Oturaq komandası ilə əlaqə saxla. Mesajını göndər, qısa zamanda cavab verək.',
    alternates: pageAlternates(lang, '/contact'),
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;
  const t = getContactDict(lang);

  return (
    <section className="min-h-screen">
      <div className="wrapper">
        <ContactHero title={t.bannerTitle} />

        <div className="py-12 md:py-16 mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <ContactInfo t={t} />
            <ContactForm t={t.form} />
          </div>
        </div>
      </div>
    </section>
  );
}
