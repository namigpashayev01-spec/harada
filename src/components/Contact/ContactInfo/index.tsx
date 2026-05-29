import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import type { ContactDict } from '@/components/Contact/translations';

export default function ContactInfo({ t }: { t: ContactDict }) {
  const items = [
    {
      icon: MapPin,
      label: t.addressLabel,
      value: t.addressValue,
      href: undefined as string | undefined,
    },
    {
      icon: Phone,
      label: t.phoneLabel,
      value: t.phoneValue,
      href: `tel:${t.phoneValue.replace(/\s/g, '')}`,
    },
    {
      icon: Mail,
      label: t.emailLabel,
      value: t.emailValue,
      href: `mailto:${t.emailValue}`,
    },
    {
      icon: Clock,
      label: t.hoursLabel,
      value: t.hoursValue,
      href: undefined,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#eefae1] px-4 py-1.5 text-sm font-semibold text-[#14532d]">
          ✦ {t.badge}
        </span>
        <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          {t.heading}
        </h2>
        <p className="mt-4 max-w-md text-lg text-gray-600">{t.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          const content = (
            <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:border-[#006653]/30 hover:shadow-md">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eefae1]">
                <Icon className="h-5 w-5 text-[#006653]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {item.label}
                </p>
                <p className="mt-1 break-words font-medium text-gray-800">
                  {item.value}
                </p>
              </div>
            </div>
          );
          return item.href ? (
            <a key={item.label} href={item.href} className="block">
              {content}
            </a>
          ) : (
            <div key={item.label}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}
