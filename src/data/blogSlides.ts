import BgImage from '@/assets/images/estate.jpg';
import { StaticImageData } from 'next/image';
interface BlogSlide {
  title: string;
  description: string;
  rightTitle: string;
  backgroundImage: StaticImageData;
}

export const blogSlides: BlogSlide[] = [
  {
    title: 'What Can We Do for You?',
    description:
      'The group includes three full-service real estate agencies: Premium Properties (Dubai), Capital Real Estate LLC (Baku) and Luxury Immobilien GmbH (Vienna).',
    rightTitle: 'Restaurant Harbour Residences',
    backgroundImage: BgImage,
  },
  {
    title: 'Our Premium Services',
    description:
      'We offer comprehensive real estate solutions including property management, investment consulting, and luxury property sales across three major markets.',
    rightTitle: 'Luxury Waterfront Villas',
    backgroundImage: BgImage,
  },
  {
    title: 'Global Real Estate Network',
    description:
      'With offices in Dubai, Baku, and Vienna, we provide international real estate expertise and cross-border investment opportunities.',
    rightTitle: 'Commercial Developments',
    backgroundImage: BgImage,
  },
  {
    title: 'Investment Opportunities',
    description:
      'Discover high-yield real estate investments and development projects across emerging and established markets in the Middle East and Europe.',
    rightTitle: 'Mixed-Use Complexes',
    backgroundImage: BgImage,
  },
  {
    title: 'Property Management',
    description:
      'Full-service property management solutions including maintenance, tenant relations, and portfolio optimization for maximum returns.',
    rightTitle: 'Residential Communities',
    backgroundImage: BgImage,
  },
  {
    title: 'Luxury Real Estate',
    description:
      'Exclusive access to premium properties, penthouses, and luxury estates in the most desirable locations across our three markets.',
    rightTitle: 'Executive Residences',
        backgroundImage: BgImage,
  },
];
