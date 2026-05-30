export type RestaurantRegisterDict = {
  // Header / intro
  ownerArea: string;
  support: string;
  bannerTitle: string;
  badge: string;
  heading: string;
  subtitle: string;
  benefits: string[];

  // Help block
  helpTitle: string;
  helpText: string;

  // Section / step titles
  sectionInfo: string;
  sectionLocation: string;
  sectionPhotos: string;
  sectionContact: string;

  // Stepper / navigation
  step: string;
  next: string;
  back: string;

  // Fields
  name: string;
  namePh: string;
  cuisine: string;
  cuisinePh: string;
  cuisineOptions: string[];
  avgPrice: string;
  avgPricePh: string;
  description: string;
  descriptionPh: string;

  address: string;
  addressPh: string;
  district: string;
  districtPh: string;
  openFrom: string;
  openTo: string;
  mapLink: string;
  mapLinkPh: string;

  photosHint: string;
  photosButton: string;
  restaurantPhotosTitle: string;
  menuPhotosTitle: string;

  ownerName: string;
  ownerNamePh: string;
  phone: string;
  phonePh: string;
  email: string;
  emailPh: string;
  website: string;
  websitePh: string;

  optional: string;
  requiredErr: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successText: string;
  again: string;
};

// Dəstək əlaqə məlumatları (formanı doldurarkən kömək üçün)
export const SUPPORT_PHONE = '+994 77 323 12 07';
export const SUPPORT_EMAIL = 'partner@diny.az';

// Bakı rayonları — bütün dillərdə eyni saxlanılır (xüsusi adlar)
export const BAKU_DISTRICTS = [
  'Nəsimi',
  'Yasamal',
  'Səbail',
  'Nərimanov',
  'Xətai',
  'Binəqədi',
  'Nizami',
  'Suraxanı',
  'Sabunçu',
  'Xəzər',
  'Qaradağ',
  'Pirallahı',
];

const dict: Record<'az' | 'en' | 'ru', RestaurantRegisterDict> = {
  az: {
    ownerArea: 'Restoran sahibləri üçün',
    support: 'Bizimlə əlaqə',
    bannerTitle: 'Restoranınızı qeydiyyatdan keçirin',
    badge: 'Tərəfdaşlıq',
    heading: 'Restoranınızı minlərlə qonağa təqdim edin',
    subtitle:
      'Aşağıdakı formanı doldurun — restoranınızın məlumatları bizə çatacaq və komandamız sizinlə əlaqə saxlayıb platformaya əlavə edəcək.',
    benefits: [
      'Yeni müştərilərə çıxış və onlayn rezervasiyalar',
      'Restoranınız üçün ayrıca səhifə və qalereya',
      'Qeydiyyat tamamilə pulsuzdur',
    ],
    helpTitle: 'Köməyə ehtiyacınız var?',
    helpText:
      'Formanı doldurarkən hər hansı çətinlik yaşasanız, komandamız kömək etməyə hazırdır.',
    sectionInfo: 'Restoran haqqında',
    sectionLocation: 'Yer və iş saatları',
    sectionPhotos: 'Şəkillər',
    sectionContact: 'Əlaqə məlumatları',
    step: 'Addım',
    next: 'Növbəti',
    back: 'Geri',
    name: 'Restoran adı',
    namePh: 'Məsələn: Şirvanşah Restoranı',
    cuisine: 'Mətbəx növü',
    cuisinePh: 'Bir və ya bir neçə mətbəx növü seçin',
    cuisineOptions: [
      'Azərbaycan',
      'Türk',
      'Avropa',
      'İtalyan',
      'Yapon / Suşi',
      'Dəniz məhsulları',
      'Fast food',
      'Kafe / Qəlyanaltı',
      'Digər',
    ],
    avgPrice: 'Orta hesab (nəfər başına, ₼)',
    avgPricePh: 'Məsələn: 35',
    description: 'Qısa təsvir',
    descriptionPh: 'Restoranınız, atmosfer və xüsusiyyətləri haqqında bir neçə cümlə...',
    address: 'Ünvan',
    addressPh: 'Küçə, bina, orientir',
    district: 'Rayon',
    districtPh: 'Rayon seçin',
    openFrom: 'Açılış saatı',
    openTo: 'Bağlanış saatı',
    mapLink: 'Google Maps linki',
    mapLinkPh: 'https://maps.google.com/...',
    photosHint: 'Şəkilləri bura sürükləyin və ya seçin (JPG, PNG — maks. 5 MB)',
    photosButton: 'Şəkil seç',
    restaurantPhotosTitle: 'Restoran şəkilləri',
    menuPhotosTitle: 'Menyu şəkilləri',
    ownerName: 'Ad, Soyad',
    ownerNamePh: 'Əlaqə şəxsinin adı',
    phone: 'Telefon',
    phonePh: '+994 __ ___ __ __',
    email: 'E-poçt',
    emailPh: 'ad@restoran.az',
    website: 'Vebsayt / Instagram',
    websitePh: '@restoran və ya sayt ünvanı',
    optional: 'könüllü',
    requiredErr: 'Zəhmət olmasa məcburi (*) sahələri doldurun.',
    submit: 'Müraciəti göndər',
    submitting: 'Göndərilir...',
    successTitle: 'Müraciətiniz qəbul edildi!',
    successText:
      'Restoranınızın məlumatları bizə çatdı. Komandamız qısa zamanda sizinlə əlaqə saxlayacaq.',
    again: 'Yeni müraciət göndər',
  },
  en: {
    ownerArea: 'For restaurant owners',
    support: 'Get help',
    bannerTitle: 'Register your restaurant',
    badge: 'Partnership',
    heading: 'Put your restaurant in front of thousands of guests',
    subtitle:
      'Fill in the form below — your restaurant details reach us and our team will contact you and add it to the platform.',
    benefits: [
      'Access to new customers and online reservations',
      'A dedicated page and gallery for your restaurant',
      'Registration is completely free',
    ],
    helpTitle: 'Need help?',
    helpText:
      'If you run into any difficulty while filling in the form, our team is here to help.',
    sectionInfo: 'About the restaurant',
    sectionLocation: 'Location & working hours',
    sectionPhotos: 'Photos',
    sectionContact: 'Contact details',
    step: 'Step',
    next: 'Next',
    back: 'Back',
    name: 'Restaurant name',
    namePh: 'e.g. Shirvanshah Restaurant',
    cuisine: 'Cuisine type',
    cuisinePh: 'Select one or more cuisine types',
    cuisineOptions: [
      'Azerbaijani',
      'Turkish',
      'European',
      'Italian',
      'Japanese / Sushi',
      'Seafood',
      'Fast food',
      'Cafe / Snacks',
      'Other',
    ],
    avgPrice: 'Average check (per person, ₼)',
    avgPricePh: 'e.g. 35',
    description: 'Short description',
    descriptionPh: 'A few sentences about your restaurant, atmosphere and highlights...',
    address: 'Address',
    addressPh: 'Street, building, landmark',
    district: 'District',
    districtPh: 'Select a district',
    openFrom: 'Opening time',
    openTo: 'Closing time',
    mapLink: 'Google Maps link',
    mapLinkPh: 'https://maps.google.com/...',
    photosHint: 'Drag photos here or browse (JPG, PNG — max 5 MB)',
    photosButton: 'Choose photo',
    restaurantPhotosTitle: 'Restaurant photos',
    menuPhotosTitle: 'Menu photos',
    ownerName: 'Full name',
    ownerNamePh: 'Contact person name',
    phone: 'Phone',
    phonePh: '+994 __ ___ __ __',
    email: 'Email',
    emailPh: 'name@restaurant.az',
    website: 'Website / Instagram',
    websitePh: '@restaurant or site URL',
    optional: 'optional',
    requiredErr: 'Please fill in the required (*) fields.',
    submit: 'Send application',
    submitting: 'Sending...',
    successTitle: 'Your application has been received!',
    successText:
      "Your restaurant details reached us. Our team will get in touch with you shortly.",
    again: 'Send another application',
  },
  ru: {
    ownerArea: 'Для владельцев ресторанов',
    support: 'Связаться с нами',
    bannerTitle: 'Зарегистрируйте свой ресторан',
    badge: 'Партнёрство',
    heading: 'Покажите свой ресторан тысячам гостей',
    subtitle:
      'Заполните форму ниже — данные вашего ресторана поступят к нам, и наша команда свяжется с вами и добавит его на платформу.',
    benefits: [
      'Доступ к новым клиентам и онлайн-бронированиям',
      'Отдельная страница и галерея для вашего ресторана',
      'Регистрация полностью бесплатна',
    ],
    helpTitle: 'Нужна помощь?',
    helpText:
      'Если при заполнении формы возникнут трудности, наша команда готова помочь.',
    sectionInfo: 'О ресторане',
    sectionLocation: 'Расположение и часы работы',
    sectionPhotos: 'Фотографии',
    sectionContact: 'Контактные данные',
    step: 'Шаг',
    next: 'Далее',
    back: 'Назад',
    name: 'Название ресторана',
    namePh: 'Напр.: Ресторан Ширваншах',
    cuisine: 'Тип кухни',
    cuisinePh: 'Выберите один или несколько типов кухни',
    cuisineOptions: [
      'Азербайджанская',
      'Турецкая',
      'Европейская',
      'Итальянская',
      'Японская / Суши',
      'Морепродукты',
      'Фастфуд',
      'Кафе / Закуски',
      'Другое',
    ],
    avgPrice: 'Средний чек (на человека, ₼)',
    avgPricePh: 'Напр.: 35',
    description: 'Краткое описание',
    descriptionPh: 'Несколько предложений о ресторане, атмосфере и особенностях...',
    address: 'Адрес',
    addressPh: 'Улица, здание, ориентир',
    district: 'Район',
    districtPh: 'Выберите район',
    openFrom: 'Время открытия',
    openTo: 'Время закрытия',
    mapLink: 'Ссылка Google Maps',
    mapLinkPh: 'https://maps.google.com/...',
    photosHint: 'Перетащите фото сюда или выберите (JPG, PNG — до 5 МБ)',
    photosButton: 'Выбрать фото',
    restaurantPhotosTitle: 'Фотографии ресторана',
    menuPhotosTitle: 'Фотографии меню',
    ownerName: 'Имя, фамилия',
    ownerNamePh: 'Имя контактного лица',
    phone: 'Телефон',
    phonePh: '+994 __ ___ __ __',
    email: 'Эл. почта',
    emailPh: 'name@restaurant.az',
    website: 'Сайт / Instagram',
    websitePh: '@ресторан или адрес сайта',
    optional: 'необязательно',
    requiredErr: 'Пожалуйста, заполните обязательные (*) поля.',
    submit: 'Отправить заявку',
    submitting: 'Отправка...',
    successTitle: 'Ваша заявка принята!',
    successText:
      'Данные вашего ресторана получены. Наша команда свяжется с вами в ближайшее время.',
    again: 'Отправить ещё одну заявку',
  },
};

export function getRestaurantRegisterDict(lang: string): RestaurantRegisterDict {
  return dict[lang as 'az' | 'en' | 'ru'] ?? dict.az;
}
