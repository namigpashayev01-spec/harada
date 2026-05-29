interface PageBannerProps {
  backgroundImage: string;
  title: string;
  subtitle?: string;
}

export default function PageBanner({
  backgroundImage,
  title,
  subtitle,
}: PageBannerProps) {
  return (
    <div className="relative flex items-center justify-center mt-16">
      <div
        className="rounded-[12px] flex items-center justify-center overflow-hidden"
        style={{
          background: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          minHeight: '50vh',
          width: '100%',
          position: 'relative',
        }}>
        <div className="absolute inset-0 bg-black/40 z-[1]" />
      </div>

      <div className="absolute z-10 text-center text-white">
        <h1 className="text-5xl line-clamp-5 leading-[46px] font-semibold">
          {title}
        </h1>
        {subtitle && <p className="text-xl mt-4 opacity-90">{subtitle}</p>}
      </div>
    </div>
  );
}
