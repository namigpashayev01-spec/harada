/**
 * Azerbaijani — the source of truth for which keys exist.
 *
 * `en.ts` and `ru.ts` are typed against `TranslationKey`, so adding a key here
 * without translating it there is a type error rather than an Azerbaijani word
 * silently leaking onto the English or Russian page.
 *
 * Placeholders use `{name}` and are filled in by `interpolate()` (see ../types).
 */
export const az = {
  /* ---------------------------------------------------------------- common */
  'common.all': 'Hamısı',
  'common.seeAll': 'Hamısına bax',
  'common.close': 'Bağla',
  'common.category': 'Kateqoriya',
  'common.property': 'Xüsusiyyət',
  'common.restaurant': 'Restoran',
  'common.blog': 'Bloq',
  'common.article': 'Məqalə',
  'common.scrollLeft': 'Geri sürüşdür',
  'common.scrollRight': 'İrəli sürüşdür',

  /* ------------------------------------------------------------ navigation */
  'nav.home': 'Ana səhifə',
  'nav.homeShort': 'Əsas',
  'nav.about': 'Haqqımızda',
  'nav.places': 'Məkanlar',
  'nav.blog': 'Bloq',
  'nav.contact': 'Əlaqə',
  'nav.account': 'Hesab',
  'nav.login': 'Daxil ol',
  'nav.loginShort': 'Giriş',
  'nav.register': 'Qeydiyyat',
  'nav.logout': 'Çıxış',
  'nav.favorites': 'Sevimlilər',
  'nav.reviews': 'Rəylər',
  'nav.reservations': 'Rezervlər',
  'nav.profileSettings': 'Profil ayarları',
  'nav.more': 'Daha çox',
  'nav.pages': 'Səhifələr',
  'nav.language': 'Dil',

  /* ---------------------------------------------------------------- footer */
  'footer.getStarted': 'Başlayaq',
  'footer.registerRestaurant': 'Restoranımı qeydiyyatdan keçir',
  'footer.download': 'Yüklə',
  'footer.copyright': 'Müəllif hüquqları © {year}. Bütün hüquqlar qorunur.',
  'footer.countries': 'Ölkələr',
  'footer.privacy': 'Məxfilik siyasəti',
  'privacy.updated': 'Son yenilənmə: {date}',

  /* ------------------------------------------------------------------ hero */
  'hero.badge': 'Bakının ən yaxşı masaları',
  'hero.titleLine1': 'Bakıda ən yaxşı restoranı',
  'hero.titleLine2': 'tap və rezerv et',
  'hero.subtitle':
    'Rayon və ya mətbəx üzrə axtar, masanı bir neçə saniyəyə rezerv et — pulsuz və ani təsdiq.',
  'hero.imageAlt': 'Bakı restoranları',

  /* ---------------------------------------------------------------- search */
  'search.locationPlaceholder': 'Rayon / Metro',
  'search.queryPlaceholder': 'Mətbəx, restoran adı...',
  'search.mobilePlaceholder': 'Restoran və ya mətbəx axtar',
  'search.searching': 'Axtarılır…',
  'search.noResults': 'Nəticə tapılmadı',
  'search.submit': 'AXTAR',
  'search.submitShort': 'Axtar',
  'search.myLocation': 'Mənim yerim',
  'search.locating': 'Yer təyin edilir…',
  'search.usingMyLocation': 'Mənim yerim (ən yaxınlar)',
  'search.geoDenied': 'Məkan icazəsi bağlıdır. Brauzerin ünvan sətrindəki kilid işarəsinə toxunub "Məkan" icazəsini açın, sonra yenidən cəhd edin.',
  'search.geoUnsupported': 'Bu brauzer məkan təyinini dəstəkləmir.',
  'search.cuisines': 'Mətbəxlər',
  'search.restaurants': 'Restoranlar',
  'search.cuisineCount': 'restoran',
  'search.dishes': 'Yeməklər',
  'search.dishCount': 'restoranda var',
  'search.hint': 'Əvvəlcə yer, sonra mətbəx və ya restoran yazın — sonra AXTAR düyməsinə toxunun.',

  /* --------------------------------------------------------------- filters */
  'filter.trigger': 'Filtr',
  'filter.title': 'Filtrlər',
  'filter.subtitle': 'Mətbəx, məkan tipi və təkliflər',
  'filter.offers': 'Təkliflər',
  'filter.offer': 'Endirimli',
  'filter.clear': 'Təmizlə',
  'filter.clearCount': 'Təmizlə ({n})',
  'filter.clearAll': 'Hamısını sil',
  'filter.apply': 'Nəticələri göstər',
  'filter.loading': 'Filtrlər yüklənir...',
  'filter.labelInline': 'Filtrlər:',
  'filter.activeLabel': 'Seçilmiş filtrlər:',

  /* ------------------------------------------------------------- home page */
  'home.categories.title': 'Mətbəx üzrə bax',
  'home.categories.subtitle': 'Bu gün nə yemək istəyirsən?',

  'home.popular.title': 'Populyar restoranlar',
  'home.popular.subtitle': 'Bakıda insanların rezerv etməyi sevdiyi məkanlar',

  'home.offers.badge': 'Endirimlər',
  'home.offers.title': 'Ən yaxşı təkliflər',
  'home.offers.subtitle': 'Endirimli masalar — qənaət edərək rezerv et',
  'home.offers.promoBadge': 'Endirim',
  'home.offers.promoTitle': '30%-ə qədər endirim',
  'home.offers.promoSubtitle': 'Seçilmiş restoranlarda xüsusi təkliflər',
  'home.offers.cta': 'Təkliflərə bax',

  // Fallback advertisement shown until an admin uploads a campaign.
  'home.campaign.badge': 'Tövsiyə olunan restoran',
  'home.campaign.title': 'Şəhərin ən yaxşı restoranını kəşf et',
  'home.campaign.subtitle':
    'Seçilmiş restoranlarda xüsusi təkliflərdən yararlan və masanı indi rezerv et.',
  'home.campaign.value': '20% endirim',
  'home.campaign.button': 'İndi rezerv et',

  'home.blog.title': 'Bloqumuzdan',
  'home.blog.subtitle': 'Süfrədən məsləhətlər, bələdçilər və hekayələr',

  /* ------------------------------------------------------- restaurant card */
  'card.topBadge': 'Top 10 Bakı',
  'card.offerBadge': 'Təklif',
  'card.reviewCount': '({n} rəy)',
  'card.discount': '−{percent}% endirim',
  'card.distanceAway': '{km} km uzaqda',
  'card.viewDetails': 'Ətraflı bax',

  /* ----------------------------------------------------------- places page */
  'places.bannerAlt': 'Yemək banneri',
  'places.resultsFor': '"{query}" üçün nəticələr',
  'places.inSelectedArea': 'Seçilmiş ərazidəki restoranlar',
  'places.nearby': 'Yaxınlıqdakı restoranlar',
  'places.restaurantCount': '{n} restoran',
  'places.locationError':
    'Məkan icazəsi bağlıdır, ona görə Bakı mərkəzindəki restoranlar göstərilir. Ən yaxın məkanları görmək üçün brauzerin ünvan sətrindəki kilid işarəsinə toxunub "Məkan" icazəsini açın və səhifəni yeniləyin.',
  'places.showList': 'Siyahını göstər',
  'places.showMap': 'Xəritədə göstər',
  'places.closeMap': 'Xəritəni bağla',
  'places.empty': 'Restoran tapılmadı. Filtrləri dəyişməyi sınayın.',
  'places.resetFilters': 'Filtrləri sıfırla',

  /* ------------------------------------------------------------------- map */
  'map.openInGoogleMaps': 'Google Maps-də aç',

  /* ------------------------------------------------------------------- SEO */
  'seo.home.title': 'Harada Oturaq — Restoranlar, Rezervasiya və Endirim',
  'seo.home.description':
    'Yaxınlığındakı ən yaxşı restoranları tap, menyu və qiymətlərə bax, onlayn rezervasiya et və xüsusi endirimlərdən yararlan.',

  'seo.places.title': 'Restoranlar — Yaxınlıqda yemək yeri | Harada Oturaq',
  'seo.places.description':
    'Xəritədə yaxınlığındakı restoranları tap; mətbəx, qiymət və xüsusiyyətlərə görə filtrlə, ən uyğun yeməyi seç.',

  'seo.about.title': 'Haqqımızda — Harada Oturaq',
  'seo.about.description':
    'Harada Oturaq restoran kəşf platformasıdır. Yaxınlığındakı ən yaxşı yemək yerlərini asanlıqla tapmaqda sənə kömək edirik.',

  'seo.contact.title': 'Əlaqə — Bizimlə əlaqə saxla | Harada Oturaq',
  'seo.contact.description':
    'Sual, təklif və ya əməkdaşlıq üçün Harada Oturaq komandası ilə əlaqə saxla. Mesajını göndər, qısa zamanda cavab verək.',

  'seo.restaurantRegister.title':
    'Restoranını qeydiyyatdan keçir | Harada Oturaq',
  'seo.restaurantRegister.description':
    'Restoranını Harada Oturaq platformasına əlavə et, yeni müştərilərə çat və onlayn rezervasiya qəbul etməyə başla.',

  'seo.place.description':
    '{title} — ünvan, menyu, qiymət və rəylər. {brand} ilə onlayn rezervasiya et.',
  'seo.place.fallbackDescription':
    'Restoran haqqında ətraflı məlumat: ünvan, menyu, qiymət və rəylər. Onlayn rezervasiya et.',

  'seo.blog.description': '{title} — {brand} bloqunda oxu.',
  'seo.blog.fallbackDescription':
    'Restoranlar və yemək haqqında məqalə. Harada Oturaq bloqunda oxu.',

  'seo.dashboard.title': 'Hesabım — Harada Oturaq',
  'seo.dashboard.description':
    'Şəxsi kabinet: rezervasiyalarını, sevimli restoranlarını və rəylərini idarə et.',

  'seo.login.title': 'Daxil ol — Harada Oturaq',
  'seo.login.description':
    'Harada Oturaq hesabına daxil ol, sevimli restoranlarını və rezervasiyalarını idarə et.',

  'seo.register.title': 'Qeydiyyat — Harada Oturaq',
  'seo.register.description':
    'Harada Oturaq-da pulsuz hesab yarat, restoranları kəşf et, rezervasiya et və sevimlilərini saxla.',

  /* ------------------------------------------------------------ menu SEO */
  'seo.menu.title': '{name} Menyu və Qiymətlər',
  'seo.menu.titleShort': '{name} Menyu',
  'seo.menu.dishesOne': '{n} yemək',
  'seo.menu.dishesFew': '{n} yemək',
  'seo.menu.dishesMany': '{n} yemək',
  'seo.menu.lead': '{name} menyusu: {dishes}',
  'seo.menu.leadNoCount': '{name} menyusu',
  'seo.menu.priceRange': 'qiymətlər {min}–{max} ₼',
  'seo.menu.pricesFrom': 'qiymətlər {min} ₼-dan',
  'seo.menu.cta': 'Onlayn masa rezerv et — pulsuz.',
  'seo.menu.fallbackDescription': 'Restoran menyusu: yeməklər, qiymətlər və şəkillər. Onlayn masa rezerv et.',
  'menu.subtitle': '{dishes} · {prices}',
  'menu.sectionCount': '{n} bölmə',

  /* --------------------------------------------------- taksonomiya səhifələri */
  'tax.cuisine.heading': '{name} restoranları — Bakı',
  'tax.category.heading': '{name} — Bakıdakı məkanlar',
  'tax.district.heading': '{name} rayonunda restoranlar',
  'tax.cuisine.lead': 'Bakıda {name} təqdim edən {count} məkan. Menyu, qiymət, iş saatları və onlayn rezervasiya.',
  'tax.category.lead': 'Bakıda {name} üzrə {count} məkan. Menyu, qiymət, iş saatları və onlayn rezervasiya.',
  'tax.district.lead': '{name} rayonunda {count} restoran və kafe. Menyu, qiymət, iş saatları və onlayn rezervasiya.',
  'tax.cuisine.title': '{name} restoranları Bakıda',
  'tax.category.title': '{name} — Bakıdakı ən yaxşı məkanlar',
  'tax.district.title': '{name} rayonunda restoranlar',
  'tax.index.cuisines': 'Mətbəxlər',
  'tax.index.categories': 'Kateqoriyalar',
  'tax.index.districts': 'Rayonlar',
  'tax.index.cuisines.lead': 'Mətbəx növünə görə Bakıdakı restoranları seçin.',
  'tax.index.categories.lead': 'Kateqoriyaya görə Bakıdakı məkanları seçin.',
  'tax.index.districts.lead': 'Rayona görə restoranları seçin.',
  'tax.count': '{n} məkan',
  'tax.empty': 'Bu bölmədə hələ məkan yoxdur.',
  'tax.browseOther': 'Digər bölmələr',
  'tax.allPlaces': 'Bütün restoranlar',
  'tax.page': '{n}-ci səhifə',
  'tax.prev': 'Əvvəlki',
  'tax.next': 'Növbəti',
  // Azərbaycandan kənar şəhərlər (/uzbekistan/tashkent).
  'tax.city.heading': '{name} restoranları',
  'tax.city.title': '{name} restoranları — ünvan və iş saatları | Harada Oturaq',
  'tax.city.lead': '{name} şəhərində {count} restoran və kafe — ünvan, iş saatları, telefon və mətbəx növü bir yerdə.',
  'tax.index.cities': 'Xarici restoranlar',
  'tax.index.cities.lead': 'Şəhər seçin: ünvan, iş saatları və telefon.',
  // Ölkə adı hər dildə fərqli hallanır (rusca "Рестораны Узбекистана"), ona görə
  // yer-tutucu yox, hər ölkə üçün ayrıca açar.
  'hub.uz.badge': "Özbəkistanın ən yaxşı masaları",
  'hub.uz.line1': "Özbəkistanda ən yaxşı restoranı",
  'hub.uz.line2': "tap və rezerv et",
  'tax.index.cities.uz': 'Özbəkistan restoranları',
  'tax.index.cities.uz.lead': 'Şəhər seçin: Özbəkistan restoranlarının ünvanı, iş saatları və telefonu.',
  'hub.ca.badge': "Kanadanın ən yaxşı masaları",
  'hub.ca.line1': "Kanadada ən yaxşı restoranı",
  'hub.ca.line2': "tap və rezerv et",
  'tax.index.cities.ca': 'Kanada restoranları',
  'tax.index.cities.ca.lead': 'Şəhər seçin: Kanada restoranlarının ünvanı, iş saatları və telefonu.',
  'hub.nl.badge': "Niderlandın ən yaxşı masaları",
  'hub.nl.line1': "Niderlandda ən yaxşı restoranı",
  'hub.nl.line2': "tap və rezerv et",
  'tax.index.cities.nl': 'Niderland restoranları',
  'tax.index.cities.nl.lead': 'Şəhər seçin: Niderland restoranlarının ünvanı, iş saatları və telefonu.',
  'hub.rs.badge': "Serbiyanın ən yaxşı masaları",
  'hub.rs.line1': "Serbiyada ən yaxşı restoranı",
  'hub.rs.line2': "tap və rezerv et",
  'tax.index.cities.rs': 'Serbiya restoranları',
  'tax.index.cities.rs.lead': 'Şəhər seçin: Serbiya restoranlarının ünvanı, iş saatları və telefonu.',
  'hub.lv.badge': "Latviyanın ən yaxşı masaları",
  'hub.lv.line1': "Latviyada ən yaxşı restoranı",
  'hub.lv.line2': "tap və rezerv et",
  'tax.index.cities.lv': 'Latviya restoranları',
  'tax.index.cities.lv.lead': 'Şəhər seçin: Latviya restoranlarının ünvanı, iş saatları və telefonu.',

} as const;

export type TranslationKey = keyof typeof az;
