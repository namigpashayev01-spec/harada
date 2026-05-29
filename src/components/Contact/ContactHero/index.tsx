import BannerImg from '@/assets/images/banner.jpg';
import { PageBanner } from '@/components/common';

export default function ContactHero({ title }: { title: string }) {
  return <PageBanner backgroundImage={BannerImg.src} title={title} />;
}
