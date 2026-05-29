import Image from 'next/image';
import React from 'react';
import LogoImg from '@/assets/images/logo.png';
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

  return (
    <footer className="pt-[100px] pb-[15px]">
      <div className="wrapper">
        <div className="rounded-[30px] bg-[#1C5858] min-h-[200px] h-full px-4 sm:px-8 lg:px-[58px] py-[25px]">
          <div className="flex flex-col lg:flex-row items-center justify-between min-h-[200px] h-full gap-8 lg:gap-4">
            <div className="flex flex-col items-center lg:items-start gap-[18px] text-center lg:text-left">
              <h2 className="text-white text-2xl lg:text-3xl font-semibold">
                {"Let's get started"}
              </h2>
              <button className="bg-[#F57D0D] cursor-pointer hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Register my restaurant
              </button>
            </div>

            {/* Center Section - Logo and Navigation */}
            <div className="flex flex-col items-center justify-center gap-[31px] text-white order-first lg:order-none">
              <Link href={`/${lang}`} className="w-[72px] block">
                <Image
                  alt="Logo"
                  className="w-full h-full object-cover"
                  src={footerLogo || LogoImg}
                  width={72}
                  height={72}
                  priority
                />
              </Link>
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-[30px]">
                {navbarData.map((item) => (
                  <Link
                    className="font-medium text-[14px] text-white hover:text-orange-300 transition-colors"
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
              Copyright © 2020. LogoIpsum. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
