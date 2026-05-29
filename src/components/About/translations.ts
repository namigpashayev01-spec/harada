export type AboutDict = {
  badge: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;

  statRestaurants: string;
  statReservations: string;
  statMembers: string;
  statReviews: string;

  storyTitle: string;
  storyParagraphs: string[];
  monthlyMembersLabel: string;
  reviewsLabel: string;

  featuresTitle: string;
  featuresSubtitle: string;
  features: { title: string; desc: string }[];

  stepsTitle: string;
  stepsSubtitle: string;
  steps: { title: string; desc: string }[];

  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
};

const dict: Record<'az' | 'en' | 'ru', AboutDict> = {
  az: {
    badge: 'Haqqımızda',
    title: 'Bakının ən yaxşı masalarını bir araya gətiririk',
    subtitle:
      'Biz restoran axtarışını və rezervasiyanı sadələşdiririk. Bir neçə kliklə şəhərin ən yaxşı məkanlarını tap, masanı ani təsdiqlə rezerv et — pulsuz və rahat.',
    ctaPrimary: 'Restoranları kəşf et',
    ctaSecondary: 'Bizimlə əlaqə',

    statRestaurants: 'Restoran',
    statReservations: 'Aylıq rezervasiya',
    statMembers: 'Məmnun qonaq',
    statReviews: 'İstifadəçi rəyi',

    storyTitle: 'Bizim hekayəmiz',
    storyParagraphs: [
      'Məqsədimiz sadədir: Bakıda kafe və restoranlarda masa tapmağı və rezerv etməyi mümkün qədər asanlaşdırmaq. Artıq telefon zəngləri, gözləmə və qeyri-müəyyənlik yoxdur.',
      'Platformamız yüzlərlə məkanı, real rəyləri və canlı boş masaları bir yerə toplayır — sən sadəcə zövqünə uyğun yeri seçib gəlirsən. Restoran sahibləri üçün isə daha çox qonaq və asan idarəetmə deməkdir.',
    ],
    monthlyMembersLabel: 'Aylıq istifadəçi',
    reviewsLabel: 'rəy',

    featuresTitle: 'Niyə məhz biz?',
    featuresSubtitle:
      'Rezervasiyanı stresszsiz və sürətli edən hər şey bir yerdə.',
    features: [
      {
        title: 'Pulsuz rezervasiya',
        desc: 'Masanı rezerv etmək tamamilə pulsuzdur — gizli ödəniş yoxdur.',
      },
      {
        title: 'Ani təsdiq',
        desc: 'Rezervasiyan dərhal təsdiqlənir, dəqiqələrlə gözləmirsən.',
      },
      {
        title: 'Real rəylər',
        desc: 'Digər qonaqların həqiqi rəylərinə əsasən doğru seçim et.',
      },
      {
        title: 'Ən yaxşı məkanlar',
        desc: 'Şəhərin ən populyar restoran və kafeləri bir platformada.',
      },
    ],

    stepsTitle: 'Necə işləyir?',
    stepsSubtitle: 'Cəmi üç addımda masanı rezerv et.',
    steps: [
      {
        title: 'Axtar',
        desc: 'Rayon, mətbəx və ya restoran adı üzrə axtarış et.',
      },
      {
        title: 'Seç',
        desc: 'Rəylərə və qiymətlərə baxıb sənə uyğun məkanı seç.',
      },
      {
        title: 'Rezerv et',
        desc: 'Tarix və saatı seç, masan ani təsdiqlə hazırdır.',
      },
    ],

    ctaTitle: 'Restoranınız var?',
    ctaText:
      'Platformamıza qoşulun, daha çox qonaq qəbul edin və rezervasiyaları asanlıqla idarə edin.',
    ctaButton: 'Restoranımı qeydiyyatdan keçir',
  },

  en: {
    badge: 'About Us',
    title: 'We bring together the best tables in Baku',
    subtitle:
      'We make finding and booking restaurants effortless. In a few clicks, discover the city’s best spots and reserve your table with instant confirmation — free and convenient.',
    ctaPrimary: 'Explore restaurants',
    ctaSecondary: 'Contact us',

    statRestaurants: 'Restaurants',
    statReservations: 'Monthly bookings',
    statMembers: 'Happy guests',
    statReviews: 'User reviews',

    storyTitle: 'Our story',
    storyParagraphs: [
      'Our goal is simple: make finding and booking a table at cafés and restaurants in Baku as easy as possible. No more phone calls, waiting, or uncertainty.',
      'Our platform brings together hundreds of venues, real reviews, and live table availability — you just pick the place that suits your taste and show up. For restaurant owners, it means more guests and effortless management.',
    ],
    monthlyMembersLabel: 'Monthly members',
    reviewsLabel: 'reviews',

    featuresTitle: 'Why choose us',
    featuresSubtitle: 'Everything that makes booking fast and stress-free.',
    features: [
      {
        title: 'Free booking',
        desc: 'Reserving a table is completely free — no hidden fees.',
      },
      {
        title: 'Instant confirmation',
        desc: 'Your reservation is confirmed instantly, no waiting around.',
      },
      {
        title: 'Real reviews',
        desc: 'Make the right choice based on genuine guest reviews.',
      },
      {
        title: 'Best venues',
        desc: 'The city’s most popular restaurants and cafés in one place.',
      },
    ],

    stepsTitle: 'How it works',
    stepsSubtitle: 'Reserve your table in just three steps.',
    steps: [
      {
        title: 'Search',
        desc: 'Search by district, cuisine, or restaurant name.',
      },
      {
        title: 'Choose',
        desc: 'Browse reviews and prices, then pick the right spot.',
      },
      {
        title: 'Reserve',
        desc: 'Select a date and time — your table is confirmed instantly.',
      },
    ],

    ctaTitle: 'Own a restaurant?',
    ctaText:
      'Join our platform, welcome more guests, and manage reservations with ease.',
    ctaButton: 'Register my restaurant',
  },

  ru: {
    badge: 'О нас',
    title: 'Мы собираем лучшие столики Баку',
    subtitle:
      'Мы делаем поиск и бронирование ресторанов простым. В несколько кликов найдите лучшие места города и забронируйте столик с мгновенным подтверждением — бесплатно и удобно.',
    ctaPrimary: 'Смотреть рестораны',
    ctaSecondary: 'Связаться с нами',

    statRestaurants: 'Ресторанов',
    statReservations: 'Броней в месяц',
    statMembers: 'Довольных гостей',
    statReviews: 'Отзывов пользователей',

    storyTitle: 'Наша история',
    storyParagraphs: [
      'Наша цель проста: сделать поиск и бронирование столика в кафе и ресторанах Баку максимально лёгким. Больше никаких звонков, ожидания и неопределённости.',
      'Наша платформа объединяет сотни заведений, реальные отзывы и актуальное наличие столиков — вы просто выбираете место по вкусу и приходите. Для владельцев ресторанов это больше гостей и простое управление.',
    ],
    monthlyMembersLabel: 'Пользователей в месяц',
    reviewsLabel: 'отзывов',

    featuresTitle: 'Почему мы',
    featuresSubtitle:
      'Всё, что делает бронирование быстрым и без лишних хлопот.',
    features: [
      {
        title: 'Бесплатное бронирование',
        desc: 'Бронирование столика полностью бесплатно — без скрытых платежей.',
      },
      {
        title: 'Мгновенное подтверждение',
        desc: 'Ваша бронь подтверждается сразу, без ожидания.',
      },
      {
        title: 'Реальные отзывы',
        desc: 'Делайте правильный выбор на основе честных отзывов гостей.',
      },
      {
        title: 'Лучшие заведения',
        desc: 'Самые популярные рестораны и кафе города в одном месте.',
      },
    ],

    stepsTitle: 'Как это работает',
    stepsSubtitle: 'Забронируйте столик всего за три шага.',
    steps: [
      {
        title: 'Поиск',
        desc: 'Ищите по району, кухне или названию ресторана.',
      },
      {
        title: 'Выбор',
        desc: 'Смотрите отзывы и цены, затем выбирайте подходящее место.',
      },
      {
        title: 'Бронь',
        desc: 'Выберите дату и время — столик подтверждается мгновенно.',
      },
    ],

    ctaTitle: 'У вас есть ресторан?',
    ctaText:
      'Присоединяйтесь к нашей платформе, принимайте больше гостей и легко управляйте бронированиями.',
    ctaButton: 'Зарегистрировать ресторан',
  },
};

export function getAboutDict(lang: string): AboutDict {
  return dict[lang as 'az' | 'en' | 'ru'] ?? dict.az;
}
