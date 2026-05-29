export type ContactDict = {
  bannerTitle: string;
  badge: string;
  heading: string;
  subtitle: string;
  addressLabel: string;
  addressValue: string;
  phoneLabel: string;
  phoneValue: string;
  emailLabel: string;
  emailValue: string;
  hoursLabel: string;
  hoursValue: string;
  form: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
  };
};

const PHONE = '+994 77 323 12 07';
const EMAIL = 'contact@looker.com';

const dict: Record<'az' | 'en' | 'ru', ContactDict> = {
  az: {
    bannerTitle: 'Bizimlə əlaqə',
    badge: 'Əlaqə',
    heading: 'Gəlin əlaqə saxlayaq',
    subtitle:
      'Sualınız, rəyiniz və ya təklifiniz var? Sadəcə formu doldurun — qısa zamanda sizinlə əlaqə saxlayacağıq.',
    addressLabel: 'Ünvan',
    addressValue: 'Bakı şəhəri, Azərbaycan',
    phoneLabel: 'Telefon',
    phoneValue: PHONE,
    emailLabel: 'E-poçt',
    emailValue: EMAIL,
    hoursLabel: 'İş saatları',
    hoursValue: 'Hər gün, 09:00 – 22:00',
    form: {
      firstName: 'Ad',
      lastName: 'Soyad',
      email: 'E-poçt',
      phone: 'Telefon nömrəsi',
      message: 'Mesajınız...',
      submit: 'Mesaj göndər',
      submitting: 'Göndərilir...',
      success: 'Mesajınız uğurla göndərildi!',
      error: 'Mesaj göndərilə bilmədi. Yenidən cəhd edin.',
    },
  },
  en: {
    bannerTitle: 'Contact Us',
    badge: 'Get in touch',
    heading: "Let's talk with us",
    subtitle:
      "Questions, comments, or suggestions? Simply fill in the form and we'll be in touch shortly.",
    addressLabel: 'Address',
    addressValue: 'Baku, Azerbaijan',
    phoneLabel: 'Phone',
    phoneValue: PHONE,
    emailLabel: 'Email',
    emailValue: EMAIL,
    hoursLabel: 'Working hours',
    hoursValue: 'Every day, 09:00 – 22:00',
    form: {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone Number',
      message: 'Your message...',
      submit: 'Send Message',
      submitting: 'Sending...',
      success: 'Your message has been sent successfully!',
      error: 'Failed to send message. Please try again.',
    },
  },
  ru: {
    bannerTitle: 'Свяжитесь с нами',
    badge: 'Контакты',
    heading: 'Давайте поговорим',
    subtitle:
      'Вопросы, комментарии или предложения? Просто заполните форму — и мы скоро свяжемся с вами.',
    addressLabel: 'Адрес',
    addressValue: 'Баку, Азербайджан',
    phoneLabel: 'Телефон',
    phoneValue: PHONE,
    emailLabel: 'Эл. почта',
    emailValue: EMAIL,
    hoursLabel: 'Часы работы',
    hoursValue: 'Ежедневно, 09:00 – 22:00',
    form: {
      firstName: 'Имя',
      lastName: 'Фамилия',
      email: 'Эл. почта',
      phone: 'Номер телефона',
      message: 'Ваше сообщение...',
      submit: 'Отправить сообщение',
      submitting: 'Отправка...',
      success: 'Ваше сообщение успешно отправлено!',
      error: 'Не удалось отправить сообщение. Попробуйте снова.',
    },
  },
};

export function getContactDict(lang: string): ContactDict {
  return dict[lang as 'az' | 'en' | 'ru'] ?? dict.az;
}
