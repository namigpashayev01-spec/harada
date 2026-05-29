import apiClient from '@/api';
import Image from 'next/image';

interface AboutData {
  id: number;
  title: string;
  description: string;
  monthly_members: number;
  seo_title: string;
  seo_description: string;
  image: string[];
}

interface AboutResponse {
  data: AboutData;
}

const getAbout = async (): Promise<AboutResponse | null> => {
  try {
    const data = await apiClient.get<AboutResponse>('/about');
    return data;
  } catch (error) {
    console.error('Error fetching about data:', error);
    return null;
  }
};

export default async function AboutContent() {
  const response = await getAbout();
  const aboutData = response?.data;

  const monthlyMembers = aboutData?.monthly_members || 5000;
  const title = aboutData?.title || 'About Us';
  const description =
    aboutData?.description || 'Welcome to AU Natural Organics...';
  const image = aboutData?.image?.[0] || '/images/about.png';

  return (
    <section className="pt-16">
      <div className="wrapper">
        <div className="px-4 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="relative">
              <div className="relative rounded-2xl">
                <Image
                  src={image}
                  alt="Team working together"
                  className="w-full object-cover md:mb-0 mb-5"
                  width={589}
                  height={500}
                />

                <div className="absolute top-20 -right-[60px] min-w-[120px] z-[99999] bg-white px-6 py-4 shadow-lg rounded-[12px] hidden md:block">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">
                      Monthly Members
                    </p>
                    <p className="text-5xl font-bold text-[#1C2D49]">
                      {monthlyMembers.toLocaleString()}+
                    </p>
                  </div>
                </div>

                <div className="block md:hidden bg-white rounded-[12px] px-6 py-4 shadow-lg mb-6 w-fit mx-auto">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">
                      Monthly Members
                    </p>
                    <p className="text-3xl font-bold text-[#1C2D49]">
                      {monthlyMembers.toLocaleString()}+
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 bg-white rounded-2xl px-6 py-4 shadow-lg hidden md:flex items-center space-x-3">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      8000+ reviews
                    </p>
                  </div>
                </div>

                <div className="block md:hidden bg-white rounded-2xl px-6 py-4 shadow-lg w-fit mx-auto">
                  <p className="text-lg font-bold text-gray-900 text-center">
                    8000+ reviews
                  </p>
                </div>
              </div>

              <div className="absolute -top-8 -right-8 -z-10 hidden lg:block">
                <Image
                  src="/svg/group-point.svg"
                  alt="svg"
                  className="w-full object-cover"
                  width={589}
                  height={500}
                />
              </div>
              <div className="absolute -left-10 -top-10 -z-10 hidden lg:block">
                <Image
                  src="/svg/left-border.svg"
                  alt="svg"
                  className="w-full object-cover"
                  width={589}
                  height={500}
                />
              </div>
              <div className="absolute -right-10 -bottom-10 -z-10 hidden lg:block">
                <Image
                  src="/svg/right-border.svg"
                  alt="svg"
                  className="w-full object-cover"
                  width={589}
                  height={500}
                />
              </div>
            </div>

            <div className="space-y-6 lg:pt-10 px-4 lg:px-0 lg:pl-8">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-medium text-black mb-10 sm:mb-14 leading-tight sm:leading-[100%]">
                  {title}
                </h1>

                <div className="space-y-4 text-[#505050] text-base sm:text-lg leading-relaxed w-full lg:w-[80%]">
                  <p className="lg:text-base text-[13px] whitespace-pre-line">
                    {description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
