import Image from 'next/image';
import React from 'react';
import { navbarData } from '@/data/navbarData';
import Link from 'next/link';
import socialLinkService from '@/services/socialLink.service';
import taxonomyService from '@/services/taxonomy.service';
import { SocialLink } from '@/types';
import { getT } from '@/lib/i18n';
import { homeLang, langForCountry } from '@/lib/locales';

const Footer = async ({ lang = 'az', footerLogo }: { lang?: string; footerLogo?: string }) => {
  const t = getT(lang);
  let socialLinks: SocialLink[] = [];

  try {
    const response = await socialLinkService.getSocialLinks();
    socialLinks = response.data;
  } catch {
    socialLinks = [];
  }

  // Hide misconfigured social links (e.g. admin placeholder URLs pointing to
  // localhost or an /admin/ path) so users never see a broken external link.
  const isValidSocialUrl = (url?: string) => {
    if (!url) return false;
    try {
      const u = new URL(url);
      if (!/^https?:$/.test(u.protocol)) return false;
      if (/^(localhost|127\.|0\.0\.0\.0)/.test(u.hostname)) return false;
      if (u.pathname.includes('/admin')) return false;
      return true;
    } catch {
      return false;
    }
  };
  socialLinks = socialLinks.filter((l) => isValidSocialUrl(l.url));

  // Cuisine / district links in the footer are the site's main crawl path.
  // Every other listing (home, /places) builds itself in the browser, so
  // without these the HTML a crawler receives links to no restaurant at all.
  // Rendered server-side here, they appear on every page.
  const tax = await taxonomyService
    .getTaxonomies(lang)
    .catch(() => ({ cuisines: [], categories: [], districts: [], cities: [] }));

  // Cuisine / district / category pages belong to the Azerbaijani section,
  // which exists in az/en/ru only — from a Serbian page they link to English.
  const hl = homeLang(lang);
  const label = (title: Record<string, string> | undefined, fallback: string) =>
    title?.[hl] || title?.en || title?.az || fallback;

  // Foreign sections: one link per country (to its hub), not per city — the
  // list of countries keeps growing and a column per country did not scale.
  // Each hub opens in the visitor's language if the country has it, otherwise
  // in English (/sr/... exists only for Serbia).
  const countries = new Map<string, { href: string; label: string }>();
  for (const c of tax.cities ?? []) {
    if (!c.country || !c.segment || countries.has(c.country)) continue;
    countries.set(c.country, {
      href: `/${langForCountry(c.country, lang)}/${c.segment}`,
      label: c.country_title?.[lang] || c.country_title?.en || c.country,
    });
  }

  const linkGroups: { key: string; href?: string; terms: { href: string; label: string }[] }[] = [
    {
      key: 'tax.index.cuisines',
      href: `/${hl}/cuisine`,
      terms: (tax.cuisines ?? []).slice(0, 8).map((c) => ({
        href: `/${hl}/cuisine/${c.slug}`,
        label: label(c.title, c.slug),
      })),
    },
    {
      key: 'tax.index.districts',
      href: `/${hl}/district`,
      terms: (tax.districts ?? []).slice(0, 8).map((d) => ({
        href: `/${hl}/district/${d.slug}`,
        label: label(d.title, d.name || d.slug),
      })),
    },
    {
      key: 'tax.index.categories',
      href: `/${hl}/category`,
      terms: (tax.categories ?? []).slice(0, 8).map((c) => ({
        href: `/${hl}/category/${c.slug}`,
        label: label(c.title, c.slug),
      })),
    },
    {
      key: 'footer.countries',
      terms: [...countries.values()].sort((a, b) => a.label.localeCompare(b.label, lang)),
    },
  ].filter((g) => g.terms.length > 0);

  return (
    <footer className="pt-[100px] pb-[15px]">
      <div className="wrapper">
        <div className="rounded-[30px] bg-[#006653] min-h-[200px] h-full px-4 sm:px-8 lg:px-[58px] py-[35px]">
          <div className="flex flex-col lg:flex-row items-center justify-between min-h-[200px] h-full gap-8 lg:gap-4">
            <div className="flex flex-col items-center lg:items-start gap-[18px] text-center lg:text-left">
              <h2 className="text-white text-2xl lg:text-3xl font-semibold">
                {t('footer.getStarted')}
              </h2>
              <Link
                href={`/${hl}/restaurant-register`}
                className="bg-[#9fe870] cursor-pointer hover:bg-[#8fdc5c] text-[#14532d] px-6 py-3 rounded-lg font-semibold transition-colors">
                {t('footer.registerRestaurant')}
              </Link>

              {/* App download buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <a
                  href="#"
                  className="flex items-center gap-2.5 rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 text-white transition-colors hover:bg-white/15">
                  {/* Official Apple logo */}
                  <svg
                    viewBox="0 0 384 512"
                    className="h-6 w-6"
                    fill="currentColor"
                    aria-hidden="true">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                  </svg>
                  <span className="text-left leading-tight">
                    <span className="block text-[10px] text-white/70">{t('footer.download')}</span>
                    <span className="block text-sm font-semibold">App Store</span>
                  </span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2.5 rounded-lg border border-white/15 bg-white/10 px-4 py-2.5 text-white transition-colors hover:bg-white/15">
                  {/* Official colored Google Play logo */}
                  <svg
                    viewBox="0 0 512 512"
                    className="h-6 w-6"
                    aria-hidden="true">
                    <path
                      fill="#34A853"
                      d="M44.7 12.1C38.9 18.3 35.5 27.9 35.5 40.4v431.2c0 12.5 3.4 22.1 9.4 28.1l1.4 1.3 241.6-241.6v-5.6L46.1 11.6l-1.4.5z"
                    />
                    <path
                      fill="#FBBC04"
                      d="M368 354.6l-80.5-80.6v-5.7l80.6-80.6 1.8 1 95.4 54.2c27.3 15.4 27.3 40.8 0 56.4l-95.4 54.2-1.9 1.1z"
                    />
                    <path
                      fill="#EA4335"
                      d="M369.9 353.5L287.5 271 44.7 513.8c9 9.5 23.7 10.6 40.4 1.2l284.8-161.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M369.9 188.5L85.1 27.1C68.4 17.5 53.7 18.8 44.7 28.3L287.5 271l82.4-82.5z"
                    />
                  </svg>
                  <span className="text-left leading-tight">
                    <span className="block text-[10px] text-white/70">{t('footer.download')}</span>
                    <span className="block text-sm font-semibold">Google Play</span>
                  </span>
                </a>
              </div>
            </div>

            {/* Center Section - Logo and Navigation */}
            <div className="flex flex-col items-center justify-center gap-[31px] text-white order-first lg:order-none">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-[30px]">
                {navbarData.map((item) => (
                  <Link
                    className="font-medium text-[14px] text-white hover:text-[#9fe870] transition-colors"
                    key={item.link}
                    href={`/${lang}${item.link === '/' ? '' : item.link}`}>
                    {t(item.key)}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-row lg:flex-col gap-3 lg:gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200">
                  <Image
                    src={link.icon}
                    alt="social link"
                    width={33}
                    height={33}
                    className="w-[33px] h-[33px] object-contain transition-all duration-200"
                  />
                </a>
              ))}
            </div>
          </div>

          {linkGroups.length > 0 && (
            <nav
              aria-label={t('tax.browseOther')}
              className="mt-10 pt-8 border-t border-white/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {linkGroups.map((group) => (
                <div key={group.key}>
                  {group.href ? (
                    <Link
                      href={group.href}
                      className="text-white font-semibold text-[14px] hover:text-[#9fe870] transition-colors">
                      {t(group.key)}
                    </Link>
                  ) : (
                    <p className="text-white font-semibold text-[14px]">{t(group.key)}</p>
                  )}
                  <ul className="mt-3 space-y-1.5">
                    {group.terms.map((term) => (
                      <li key={term.href}>
                        <Link
                          href={term.href}
                          className="text-white/70 text-[13px] hover:text-[#9fe870] transition-colors">
                          {term.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          )}

          <div className="mt-8 pt-4 border-t border-white/20 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center">
            <p className="text-white/70 text-[12px] font-poppins">
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </p>
            {/* The policy page exists in az/en/ru — foreign sections link to English. */}
            <Link
              href={`/${hl}/privacy`}
              className="text-white/70 text-[12px] font-poppins underline-offset-4 hover:text-[#9fe870] hover:underline transition-colors">
              {t('footer.privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
