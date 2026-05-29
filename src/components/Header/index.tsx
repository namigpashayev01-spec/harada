import BannerImg from '@/assets/images/banner.jpg';
import SearchBarHeader from '@/components/Header/SearchBarHeader';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  lang: string;
}

const POPULAR_SEARCHES = [
  'Azərbaycan mətbəxi',
  'Avropa',
  'Pizza',
  'Kafe',
  'Dəniz məhsulları',
];

const Header = ({ lang }: HeaderProps) => {
  return (
    <section className="pt-4 pb-6 md:pt-6 md:pb-10">
      <div className="wrapper">
        <div
          className="relative overflow-hidden rounded-[20px] px-6 py-12 sm:px-10 md:px-14 md:py-16 lg:py-20"
          style={{
            background:
              'linear-gradient(135deg, #013a30 0%, #006653 55%, #0a7d54 100%)',
          }}>
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-black/10" />

          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left: copy + search */}
            <div className="text-white">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                🍽️ Bakının ən yaxşı masaları
              </span>

              <h1 className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-[52px]">
                Bakıda ən yaxşı restoranı <br className="hidden sm:block" />
                tap və rezerv et
              </h1>
              <p className="mt-4 max-w-xl text-base text-white/85 md:text-lg">
                Rayon və ya mətbəx üzrə axtar, masanı bir neçə saniyəyə rezerv et —
                pulsuz və ani təsdiq.
              </p>

              {/* Search */}
              <div className="mt-7">
                <SearchBarHeader />
              </div>

              {/* Popular searches */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <span className="text-sm text-white/75">Populyar:</span>
                {POPULAR_SEARCHES.map((term) => (
                  <Link
                    key={term}
                    href={`/${lang}/places?search=${encodeURIComponent(term)}`}
                    className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                    {term}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: floating food image */}
            <div className="relative hidden lg:block">
              <div className="relative ml-auto aspect-[4/3] w-full max-w-[480px] overflow-hidden rounded-2xl shadow-2xl rotate-2">
                <Image
                  src={BannerImg}
                  alt="Bakı restoranları"
                  fill
                  priority
                  sizes="480px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
