/**
 * Köhnə restoran ünvanlarından yenilərinə 301 yönləndirmə.
 *
 * İki səbəbdən yarandı (2026-08-10 təmizliyi):
 *  1. İdxal iki dəfə işləmişdi — eyni restoran bazada iki qeyd kimi vardı və
 *     ikincisi "-2", "-4" sonluqlu ünvan almışdı. Təkrarlar gizlədildi
 *     (status=0), saxlanan qeyd təmiz ünvanı götürdü.
 *  2. Erkən test qeydlərinin ünvanında "-test" qalmışdı və bu ünvanlar
 *     sitemap vasitəsilə Google-a göndərilirdi.
 *
 * Xəritəni scripts/dedupe/apply.php yaradır (out/redirects_clean.json).
 * Özünə yönləndirmə (sonsuz döngə) və zəncir (a→b→c) orada süzülür — əl ilə
 * sətir əlavə edəndə buna diqqət et.
 */
export const RESTAURANT_SLUG_REDIRECTS: Record<string, string> = {
  'art-club-restaurant-2': 'art-club-restaurant',
  'art-club-restaurant-3': 'art-club-restaurant',
  'art-club-restaurant-4': 'art-club-restaurant',
  'burc-qala-2': 'burc-qala',
  'burc-qala-3': 'burc-qala',
  'burc-qala-test': 'burc-qala',
  'buta-restaurant-est-2003-test': 'buta-restaurant-est-2003',
  'by-ruslan-pizza-28-may-2': 'by-ruslan-pizza-28-may',
  'by-ruslan-pizza-28-may-3': 'by-ruslan-pizza-28-may',
  'by-ruslan-pizza-28-may-test': 'by-ruslan-pizza-28-may',
  'dadim-2': 'dadim',
  'dadim-3': 'dadim',
  'dadim-4': 'dadim',
  'dadim-5': 'dadim',
  'dadim-6': 'dadim',
  'el-pizza-2': 'el-pizza',
  'el-pizza-3': 'el-pizza',
  'el-pizza-test': 'el-pizza',
  'iberia-georgian-restaurant-2': 'iberia-georgian-restaurant',
  'iberia-georgian-restaurant-3': 'iberia-georgian-restaurant',
  'iberia-georgian-restaurant-4': 'iberia-georgian-restaurant',
  'koz-halil-usta-tantuni-28-may-test': 'koz-halil-usta-tantuni-28-may',
  'kurban-said-restaurant-2': 'kurban-said-restaurant',
  'kurban-said-restaurant-3': 'kurban-said-restaurant',
  'kurban-said-restaurant-test': 'kurban-said-restaurant',
  'milli-book-cafe-28-may-filiali-test': 'milli-book-cafe-28-may-filiali',
  'notes-gastronomy-bar-test': 'notes-gastronomy-bar',
  'pencere-insaatcilar-test': 'pencere-insaatcilar',
  'pizza-inn-2': 'pizza-inn',
  'pizza-inn-3': 'pizza-inn',
  'pizza-inn-4': 'pizza-inn',
  'pizza-inn-5': 'pizza-inn',
  'pizza-inn-6': 'pizza-inn',
  'qala-divari-2': 'qala-divari',
  'qala-divari-3': 'qala-divari',
  'qala-divari-4': 'qala-divari',
  'sushi-room-baku-2': 'sushi-room-baku',
  'sushi-room-baku-3': 'sushi-room-baku',
  'sushi-room-baku-4': 'sushi-room-baku',
  'tea-garden-145-2': 'tea-garden-145',
  'tea-garden-145-3': 'tea-garden-145',
  'tea-garden-145-4': 'tea-garden-145',
  'terrace-145-2': 'terrace-145',
  'terrace-145-3': 'terrace-145',
  'terrace-145-test': 'terrace-145',
  // 2026-09-11: ikinci dəfə yaradılıb ikisi də aktiv qalmış təkrarlar gizlədildi
  // (status=0, slug-a "-arxiv-<id>" əlavə olundu). Hədəf eyni dildəki slug-dır.
  'han-restaurant-baku-2': 'han-restaurant-baku',
  'han-restaurant-baku-3': 'han-restaurant-baku',
  'han-restaurant-baku-4': 'han-restaurant-baku',
  'chio-chio-san-2': 'chio-chio-san',
  'chio-chio-san-3': 'chio-chio-san',
  'chio-chio-san-4': 'chio-chio-san',
  'cafecity-28mall': 'cafe-city-28-mall',
  'cafecity-28mall-en': 'cafe-city-28-mall',
  'cafecity-28mall-ru': 'cafe-city-28-mall',
  'genclik-mall-ozsut-baku': 'ozsut-ganjlik-mall',
  'genclik-mall-ozsut-baku-en': 'ozsut-ganjlik-mall',
  'genclik-mall-ozsut-baku-ru': 'ozsut-ganjlik-mall',
  'prive-steak-gallery': 'prive-steak-gallery-baku',
  'prive-steak-gallery-en': 'prive-steak-gallery-baku-2',
  'prive-steak-gallery-ru': 'prive-steak-gallery-baku-3',
};
