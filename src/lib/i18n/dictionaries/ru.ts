import type { TranslationKey } from './az';

/** Russian. Typed against `az.ts` — a missing key is a type error. */
export const ru: Record<TranslationKey, string> = {
  /* ---------------------------------------------------------------- common */
  'common.all': 'Все',
  'common.seeAll': 'Смотреть все',
  'common.close': 'Закрыть',
  'common.category': 'Категория',
  'common.property': 'Услуга',
  'common.restaurant': 'Ресторан',
  'common.blog': 'Блог',
  'common.article': 'Статья',
  'common.scrollLeft': 'Прокрутить влево',
  'common.scrollRight': 'Прокрутить вправо',

  /* ------------------------------------------------------------ navigation */
  'nav.home': 'Главная',
  'nav.homeShort': 'Главная',
  'nav.about': 'О нас',
  'nav.places': 'Места',
  'nav.blog': 'Блог',
  'nav.contact': 'Контакты',
  'nav.account': 'Аккаунт',
  'nav.login': 'Войти',
  'nav.loginShort': 'Вход',
  'nav.register': 'Регистрация',
  'nav.logout': 'Выйти',
  'nav.favorites': 'Избранное',
  'nav.reviews': 'Отзывы',
  'nav.reservations': 'Брони',
  'nav.profileSettings': 'Настройки профиля',
  'nav.more': 'Ещё',
  'nav.pages': 'Страницы',
  'nav.language': 'Язык',

  /* ---------------------------------------------------------------- footer */
  'footer.getStarted': 'Начнём',
  'footer.registerRestaurant': 'Добавить свой ресторан',
  'footer.download': 'Скачать',
  'footer.copyright': 'Авторские права © {year}. Все права защищены.',
  'footer.countries': 'Страны',
  'footer.privacy': 'Политика конфиденциальности',
  'privacy.updated': 'Последнее обновление: {date}',

  /* ------------------------------------------------------------------ hero */
  'hero.badge': 'Лучшие столики Баку',
  'hero.titleLine1': 'Найдите лучший ресторан',
  'hero.titleLine2': 'в Баку и забронируйте столик',
  'hero.subtitle':
    'Ищите по району или кухне и бронируйте столик за секунды — бесплатно и с мгновенным подтверждением.',
  'hero.imageAlt': 'Рестораны Баку',

  /* ---------------------------------------------------------------- search */
  'search.locationPlaceholder': 'Район / Метро',
  'search.queryPlaceholder': 'Кухня, название ресторана...',
  'search.mobilePlaceholder': 'Поиск ресторанов или кухонь',
  'search.searching': 'Идёт поиск…',
  'search.noResults': 'Ничего не найдено',
  'search.submit': 'НАЙТИ',
  'search.submitShort': 'Поиск',
  'search.myLocation': 'Моё местоположение',
  'search.locating': 'Определяем местоположение…',
  'search.usingMyLocation': 'Моё местоположение (ближайшие)',
  'search.geoDenied': 'Доступ к геолокации заблокирован. Нажмите на значок замка в адресной строке, разрешите «Местоположение» и попробуйте снова.',
  'search.geoUnsupported': 'Браузер не поддерживает определение местоположения.',
  'search.cuisines': 'Кухни',
  'search.restaurants': 'Рестораны',
  'search.cuisineCount': 'заведений',
  'search.dishes': 'Блюда',
  'search.dishCount': 'заведений',
  'search.hint': 'Укажите место, затем кухню или ресторан — и нажмите ПОИСК.',

  /* --------------------------------------------------------------- filters */
  'filter.trigger': 'Фильтр',
  'filter.title': 'Фильтры',
  'filter.subtitle': 'Кухня, тип заведения и предложения',
  'filter.offers': 'Предложения',
  'filter.offer': 'Со скидкой',
  'filter.clear': 'Очистить',
  'filter.clearCount': 'Очистить ({n})',
  'filter.clearAll': 'Сбросить все',
  'filter.apply': 'Показать результаты',
  'filter.loading': 'Загрузка фильтров...',
  'filter.labelInline': 'Фильтры:',
  'filter.activeLabel': 'Выбранные фильтры:',

  /* ------------------------------------------------------------- home page */
  'home.categories.title': 'Выбрать по кухне',
  'home.categories.subtitle': 'Что хотите съесть сегодня?',

  'home.popular.title': 'Популярные рестораны',
  'home.popular.subtitle': 'Места, которые в Баку бронируют чаще всего',

  'home.offers.badge': 'Скидки',
  'home.offers.title': 'Лучшие предложения',
  'home.offers.subtitle': 'Столики со скидкой — бронируйте и экономьте',
  'home.offers.promoBadge': 'Скидка',
  'home.offers.promoTitle': 'Скидка до 30%',
  'home.offers.promoSubtitle': 'Спецпредложения в избранных ресторанах',
  'home.offers.cta': 'Смотреть предложения',

  'home.campaign.badge': 'Рекомендуемый ресторан',
  'home.campaign.title': 'Откройте лучший ресторан города',
  'home.campaign.subtitle':
    'Пользуйтесь спецпредложениями в избранных ресторанах и бронируйте столик прямо сейчас.',
  'home.campaign.value': 'Скидка 20%',
  'home.campaign.button': 'Забронировать',

  'home.blog.title': 'Из нашего блога',
  'home.blog.subtitle': 'Советы за столом, гиды и истории',

  /* ------------------------------------------------------- restaurant card */
  'card.topBadge': 'Топ 10 Баку',
  'card.offerBadge': 'Предложение',
  'card.reviewCount': '({n} отзывов)',
  'card.discount': '−{percent}% скидка',
  'card.distanceAway': 'в {km} км',
  'card.viewDetails': 'Подробнее',

  /* ----------------------------------------------------------- places page */
  'places.bannerAlt': 'Баннер с едой',
  'places.resultsFor': 'Результаты по запросу «{query}»',
  'places.inSelectedArea': 'Рестораны в выбранном районе',
  'places.nearby': 'Рестораны поблизости',
  'places.restaurantCount': '{n} ресторанов',
  'places.locationError':
    'Доступ к геолокации заблокирован, поэтому показаны рестораны в центре Баку. Чтобы увидеть ближайшие места, нажмите на значок замка в адресной строке, разрешите «Местоположение» и обновите страницу.',
  'places.showList': 'Показать список',
  'places.showMap': 'Показать на карте',
  'places.closeMap': 'Закрыть карту',
  'places.empty': 'Рестораны не найдены. Попробуйте изменить фильтры.',
  'places.resetFilters': 'Сбросить фильтры',

  /* ------------------------------------------------------------------- map */
  'map.openInGoogleMaps': 'Открыть в Google Картах',

  /* ------------------------------------------------------------------- SEO */
  'seo.home.title': 'Harada Oturaq — Рестораны, бронирование и скидки',
  'seo.home.description':
    'Найдите лучшие рестораны рядом с вами, посмотрите меню и цены, забронируйте столик онлайн и получите эксклюзивные скидки.',

  'seo.places.title': 'Рестораны — Где поесть рядом | Harada Oturaq',
  'seo.places.description':
    'Найдите рестораны рядом на карте; фильтруйте по кухне, цене и услугам и выберите подходящее блюдо.',

  'seo.about.title': 'О нас — Harada Oturaq',
  'seo.about.description':
    'Harada Oturaq — платформа для поиска ресторанов. Мы помогаем легко находить лучшие места, где поесть рядом с вами.',

  'seo.contact.title': 'Контакты — Свяжитесь с нами | Harada Oturaq',
  'seo.contact.description':
    'Свяжитесь с командой Harada Oturaq по вопросам, предложениям или сотрудничеству. Напишите нам — ответим в короткий срок.',

  'seo.restaurantRegister.title': 'Добавьте свой ресторан | Harada Oturaq',
  'seo.restaurantRegister.description':
    'Добавьте свой ресторан на платформу Harada Oturaq, привлекайте новых гостей и принимайте брони онлайн.',

  'seo.place.description':
    '{title} — адрес, меню, цены и отзывы. Бронируйте онлайн с {brand}.',
  'seo.place.fallbackDescription':
    'Подробная информация о ресторане: адрес, меню, цены и отзывы. Забронируйте онлайн.',

  'seo.blog.description': '{title} — читайте в блоге {brand}.',
  'seo.blog.fallbackDescription':
    'Статья о ресторанах и еде. Читайте в блоге Harada Oturaq.',

  'seo.dashboard.title': 'Мой аккаунт — Harada Oturaq',
  'seo.dashboard.description':
    'Личный кабинет: управляйте бронированиями, избранными ресторанами и отзывами.',

  'seo.login.title': 'Вход — Harada Oturaq',
  'seo.login.description':
    'Войдите в аккаунт Harada Oturaq, чтобы управлять избранными ресторанами и бронированиями.',

  'seo.register.title': 'Регистрация — Harada Oturaq',
  'seo.register.description':
    'Создайте бесплатный аккаунт Harada Oturaq, открывайте рестораны, бронируйте столики и сохраняйте избранное.',

  /* ------------------------------------------------------------ menu SEO */
  'seo.menu.title': '{name} — меню и цены',
  'seo.menu.titleShort': '{name} — меню',
  'seo.menu.dishesOne': '{n} блюдо',
  'seo.menu.dishesFew': '{n} блюда',
  'seo.menu.dishesMany': '{n} блюд',
  'seo.menu.lead': 'Меню {name}: {dishes}',
  'seo.menu.leadNoCount': 'Меню {name}',
  'seo.menu.priceRange': 'цены {min}–{max} ₼',
  'seo.menu.pricesFrom': 'цены от {min} ₼',
  'seo.menu.cta': 'Забронируйте столик онлайн — бесплатно.',
  'seo.menu.fallbackDescription': 'Меню ресторана: блюда, цены и фото. Забронируйте столик онлайн.',
  'menu.subtitle': '{dishes} · {prices}',
  'menu.sectionCount': '{n} разделов',

  /* ------------------------------------------------------ страницы разделов */
  'tax.cuisine.heading': '{name} в Баку',
  'tax.category.heading': '{name} — заведения в Баку',
  'tax.district.heading': 'Рестораны в районе {name}',
  'tax.cuisine.lead': '{count} заведений в Баку, где представлена {name}. Меню, цены, часы работы и онлайн-бронирование.',
  'tax.category.lead': '{count} заведений в Баку по категории «{name}». Меню, цены, часы работы и онлайн-бронирование.',
  'tax.district.lead': '{count} ресторанов и кафе в районе {name}. Меню, цены, часы работы и онлайн-бронирование.',
  'tax.cuisine.title': '{name} в Баку — рестораны',
  'tax.category.title': '{name} — лучшие заведения Баку',
  'tax.district.title': 'Рестораны в районе {name}',
  'tax.index.cuisines': 'Кухни',
  'tax.index.categories': 'Категории',
  'tax.index.districts': 'Районы',
  'tax.index.cuisines.lead': 'Выберите рестораны Баку по кухне.',
  'tax.index.categories.lead': 'Выберите заведения Баку по категории.',
  'tax.index.districts.lead': 'Выберите рестораны по району.',
  'tax.count': '{n} заведений',
  'tax.empty': 'В этом разделе пока нет заведений.',
  'tax.browseOther': 'Другие разделы',
  'tax.allPlaces': 'Все рестораны',
  'tax.page': 'Страница {n}',
  'tax.prev': 'Назад',
  'tax.next': 'Вперёд',
  // Без падежных форм: «{name}» подставляется в именительном падеже.
  'tax.city.heading': '{name}: рестораны и кафе',
  'tax.city.title': '{name} — рестораны, адреса и часы работы | Harada Oturaq',
  'tax.city.lead': '{name}: рестораны и кафе ({count}) — адреса, часы работы, телефоны и кухня в одном месте.',
  'tax.index.cities': 'Рестораны за рубежом',
  'tax.index.cities.lead': 'Выберите город: адреса, часы работы и телефоны.',
  'hub.uz.badge': "Лучшие столики Узбекистана",
  'hub.uz.line1': "Найдите лучший ресторан",
  'hub.uz.line2': "в Узбекистане и забронируйте столик",
  'tax.index.cities.uz': 'Рестораны Узбекистана',
  'tax.index.cities.uz.lead': 'Выберите город: адреса, часы работы и телефоны ресторанов Узбекистана.',
  'hub.ca.badge': "Лучшие столики Канады",
  'hub.ca.line1': "Найдите лучший ресторан",
  'hub.ca.line2': "в Канаде и забронируйте столик",
  'tax.index.cities.ca': 'Рестораны Канады',
  'tax.index.cities.ca.lead': 'Выберите город: адреса, часы работы и телефоны ресторанов Канады.',
  'hub.nl.badge': "Лучшие столики Нидерландов",
  'hub.nl.line1': "Найдите лучший ресторан",
  'hub.nl.line2': "в Нидерландах и забронируйте столик",
  'tax.index.cities.nl': 'Рестораны Нидерландов',
  'tax.index.cities.nl.lead': 'Выберите город: адреса, часы работы и телефоны ресторанов Нидерландов.',
  'hub.rs.badge': "Лучшие столики Сербии",
  'hub.rs.line1': "Найдите лучший ресторан",
  'hub.rs.line2': "в Сербии и забронируйте столик",
  'tax.index.cities.rs': 'Рестораны Сербии',
  'tax.index.cities.rs.lead': 'Выберите город: адреса, часы работы и телефоны ресторанов Сербии.',
  'hub.lv.badge': "Лучшие столики Латвии",
  'hub.lv.line1': "Найдите лучший ресторан",
  'hub.lv.line2': "в Латвии и забронируйте столик",
  'tax.index.cities.lv': 'Рестораны Латвии',
  'tax.index.cities.lv.lead': 'Выберите город: адреса, часы работы и телефоны ресторанов Латвии.',

};
