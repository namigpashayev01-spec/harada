import BannerImg from '@/assets/images/banner.jpg';
import SearchBarHeader from '@/components/Header/SearchBarHeader';
import Image from 'next/image';
import FoodIcon from '@/assets/icons/food-icon.svg';
// import OurSiteUsers from '@/components/Header/OurSiteUsers';

const Header = () => {
  return (
    <>
      <section className="py-[45px]">
        <div className="wrapper">
          <div
            style={{
              background: `url(${BannerImg.src})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              minHeight: '80vh',
              width: '100%',
              position: 'relative',
            }}
            className="rounded-[12px] flex items-center justify-center overflow-hidden">
            {/* <OurSiteUsers /> */}
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.34)',
              }}
              className="absolute inset-0 z-10"
            />
            <div className="relative z-40 mx-auto text-center text-white px-4">
              <span
                className="lg:mt-0 mt-5 absolute top-[120%] sm:top-[0%] left-1/2 transform -translate-x-1/2 -translate-y-[100%] text-white inline-flex items-center gap-[10px] px-4 py-2 rounded-full border border-white/50 bg-[#BEBEBE45]/10 backdrop-blur-sm"
                style={{ backdropFilter: 'blur(1.8px)' }}>
                <Image
                  src={FoodIcon}
                  className="w-[24px] h-[24px]"
                  alt="Food Icon"
                  priority
                />
                Diny-Test
              </span>

              <h1 className="pt-4 text-4xl md:text-[60px] font-semibold mb-[22px] md:mb-[42px] break-words sm:text-nowrap">
                Find your Nearby Restaurants
              </h1>
              <SearchBarHeader />
              {/* <div className="mt-4 flex flex-col items-center justify-center gap-4">
                <p className="font-semibold text-center">Popular Search :</p>
                <ul className="flex flex-wrap justify-center gap-3">
                  <li
                    className="text-white text-sm inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/50 bg-[#BEBEBE45]/10 backdrop-blur-lg"
                    style={{ backdropFilter: 'blur(9.9px)' }}>
                    Asia
                  </li>
                  <li
                    className="text-white text-sm inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/50 bg-[#BEBEBE45]/10 backdrop-blur-lg"
                    style={{ backdropFilter: 'blur(9.9px)' }}>
                    Sushi
                  </li>
                  <li
                    className="text-white text-sm inline-flex items-center gap-2 px-4 py-1 rounded-full border border-white/50 bg-[#BEBEBE45]/10 backdrop-blur-lg"
                    style={{ backdropFilter: 'blur(9.9px)' }}>
                    Friends cafe
                  </li>
                </ul>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Header;
