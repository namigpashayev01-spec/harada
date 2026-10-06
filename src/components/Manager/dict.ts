/** Manager panelinin lüğəti — əsas saytdan ayrıdır, çünki mətnlər sahibə ünvanlanıb. */
export interface ManagerDict {
  brand: string;
  nav: {
    overview: string;
    reservations: string;
    hours: string;
    blocks: string;
    menu: string;
    photos: string;
    reviews: string;
    settings: string;
  };
  logout: string;
  loginTitle: string;
  loginSubtitle: string;
  email: string;
  password: string;
  signIn: string;
  signingIn: string;
  loginFailed: string;
  notOwner: string;
  loading: string;
  save: string;
  saving: string;
  saved: string;
  failed: string;
  add: string;
  delete: string;
  cancel: string;
  confirmDelete: string;
  chooseRestaurant: string;
}

export const MANAGER_DICT: Record<string, ManagerDict> = {
  az: {
    brand: 'Restoran paneli',
    nav: {
      overview: 'Ümumi baxış',
      reservations: 'Rezervasiyalar',
      hours: 'İş saatları',
      blocks: 'Dolu saatlar',
      menu: 'Menyu və qiymətlər',
      photos: 'Şəkillər',
      reviews: 'Rəylər',
      settings: 'Restoran məlumatları',
    },
    logout: 'Çıxış',
    loginTitle: 'Restoran girişi',
    loginSubtitle: 'Restoranınıza verilmiş e-poçt və parolla daxil olun.',
    email: 'E-poçt',
    password: 'Parol',
    signIn: 'Daxil ol',
    signingIn: 'Daxil olunur…',
    loginFailed: 'E-poçt və ya parol yanlışdır.',
    notOwner:
      'Bu hesaba bağlı restoran yoxdur. Restoranınızın girişi üçün bizimlə əlaqə saxlayın.',
    loading: 'Yüklənir…',
    save: 'Yadda saxla',
    saving: 'Saxlanılır…',
    saved: 'Yadda saxlanıldı',
    failed: 'Əməliyyat alınmadı.',
    add: 'Əlavə et',
    delete: 'Sil',
    cancel: 'Ləğv et',
    confirmDelete: 'Silinsin?',
    chooseRestaurant: 'Restoran',
  },
  en: {
    brand: 'Restaurant panel',
    nav: {
      overview: 'Overview',
      reservations: 'Reservations',
      hours: 'Opening hours',
      blocks: 'Fully booked',
      menu: 'Menu & prices',
      photos: 'Photos',
      reviews: 'Reviews',
      settings: 'Restaurant details',
    },
    logout: 'Sign out',
    loginTitle: 'Restaurant sign in',
    loginSubtitle: 'Use the email and password issued to your restaurant.',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign in',
    signingIn: 'Signing in…',
    loginFailed: 'Wrong email or password.',
    notOwner:
      'No restaurant is linked to this account. Contact us to get access for your restaurant.',
    loading: 'Loading…',
    save: 'Save',
    saving: 'Saving…',
    saved: 'Saved',
    failed: 'The action failed.',
    add: 'Add',
    delete: 'Delete',
    cancel: 'Cancel',
    confirmDelete: 'Delete this?',
    chooseRestaurant: 'Restaurant',
  },
  ru: {
    brand: 'Панель ресторана',
    nav: {
      overview: 'Обзор',
      reservations: 'Бронирования',
      hours: 'Часы работы',
      blocks: 'Занятые часы',
      menu: 'Меню и цены',
      photos: 'Фотографии',
      reviews: 'Отзывы',
      settings: 'Данные ресторана',
    },
    logout: 'Выйти',
    loginTitle: 'Вход для ресторана',
    loginSubtitle: 'Используйте выданные вашему ресторану почту и пароль.',
    email: 'Эл. почта',
    password: 'Пароль',
    signIn: 'Войти',
    signingIn: 'Вход…',
    loginFailed: 'Неверная почта или пароль.',
    notOwner:
      'К этому аккаунту не привязан ресторан. Свяжитесь с нами для получения доступа.',
    loading: 'Загрузка…',
    save: 'Сохранить',
    saving: 'Сохранение…',
    saved: 'Сохранено',
    failed: 'Не удалось выполнить действие.',
    add: 'Добавить',
    delete: 'Удалить',
    cancel: 'Отмена',
    confirmDelete: 'Удалить?',
    chooseRestaurant: 'Ресторан',
  },
};

export function managerDict(lang: string): ManagerDict {
  return MANAGER_DICT[lang] ?? MANAGER_DICT.az;
}
