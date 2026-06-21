import Image from 'next/image';
import React from 'react';
import { navbarData } from '@/data/navbarData';
import Link from 'next/link';
import socialLinkService from '@/services/socialLink.service';
import { SocialLink } from '@/types';

const Footer = async ({ lang = 'az', footerLogo }: { lang?: string; footerLogo?: string }) => {
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

  return (
    <footer className="pt-[100px] pb-[15px]">
      <div className="wrapper">
        <div className="rounded-[30px] bg-[#006653] min-h-[200px] h-full px-4 sm:px-8 lg:px-[58px] py-[35px]">
          <div className="flex flex-col lg:flex-row items-center justify-between min-h-[200px] h-full gap-8 lg:gap-4">
            <div className="flex flex-col items-center lg:items-start gap-[18px] text-center lg:text-left">
              <h2 className="text-white text-2xl lg:text-3xl font-semibold">
                Başlayaq
              </h2>
              <Link
                href={`/${lang}/restaurant-register`}
                className="bg-[#9fe870] cursor-pointer hover:bg-[#8fdc5c] text-[#14532d] px-6 py-3 rounded-lg font-semibold transition-colors">
                Restoranımı qeydiyyatdan keçir
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
                    <span className="block text-[10px] text-white/70">Yüklə</span>
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
                    <span className="block text-[10px] text-white/70">Yüklə</span>
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
                    {item.text}
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

          <div className="mt-8 pt-4 border-t border-white/20">
            <p className="text-white/70 flex items-center justify-center text-center text-[12px] font-poppins">
              Müəllif hüquqları © 2025. Bütün hüquqlar qorunur.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
