export type NavLinkType = {
  link: string;
  /** Dictionary key — resolved per language at render time (see src/lib/i18n). */
  key: string;
};
export const navbarData: NavLinkType[] = [
  {
    link: '/',
    key: 'nav.home',
  },
  {
    link: '/about',
    key: 'nav.about',
  },
  {
    link: '/places',
    key: 'nav.places',
  },
  {
    link: '/blog',
    key: 'nav.blog',
  },
  {
    link: '/contact',
    key: 'nav.contact',
  },
];
