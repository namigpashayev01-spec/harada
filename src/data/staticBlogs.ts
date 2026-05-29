import { BlogItem } from '@/types/blog';

type Lang = 'az' | 'en' | 'ru';

interface LocalizedString {
  az: string;
  en: string;
  ru: string;
}

interface StaticBlog {
  id: number;
  image: string;
  date: string;
  view: number;
  slug: LocalizedString;
  title: LocalizedString;
  description: LocalizedString; // HTML
}

const IMG = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

const blogs: StaticBlog[] = [
  {
    id: 1,
    image: IMG('photo-1517248135467-4c7edcad34c4'),
    date: '12.05.2026',
    view: 1240,
    slug: {
      az: 'bakinin-en-yaxsi-10-restorani',
      en: 'top-10-restaurants-in-baku',
      ru: '10-luchshih-restoranov-baku',
    },
    title: {
      az: 'Bakının ən yaxşı 10 restoranı',
      en: 'Top 10 restaurants in Baku',
      ru: '10 лучших ресторанов Баку',
    },
    description: {
      az: '<p>Bakı son illərdə əsl qastronomiya mərkəzinə çevrilib. Şəhərin mərkəzindən sahilyanı bulvara qədər hər zövqə uyğun məkan tapmaq mümkündür.</p><p>Bu siyahıda milli mətbəxdən tutmuş müasir Avropa kələflərinə qədər şəhərin ən çox sevilən 10 restoranını topladıq. Hər biri özünəməxsus atmosferi, menyusu və xidməti ilə seçilir.</p><p>Masanı əvvəlcədən rezerv etməyi unutmayın — bu məkanlar həftə sonları çox tez dolur.</p>',
      en: '<p>In recent years Baku has turned into a genuine gastronomic hub. From the city centre to the seaside boulevard, there is a venue for every taste.</p><p>In this list we have gathered the 10 most loved restaurants in the city, from national cuisine to modern European concepts. Each stands out with its own atmosphere, menu and service.</p><p>Do not forget to book a table in advance — these places fill up fast on weekends.</p>',
      ru: '<p>За последние годы Баку превратился в настоящий гастрономический центр. От центра города до приморского бульвара найдётся заведение на любой вкус.</p><p>В этом списке мы собрали 10 самых любимых ресторанов города — от национальной кухни до современных европейских концепций. Каждый выделяется своей атмосферой, меню и сервисом.</p><p>Не забудьте забронировать столик заранее — в выходные эти места заполняются очень быстро.</p>',
    },
  },
  {
    id: 2,
    image: IMG('photo-1504674900247-0877df9cc836'),
    date: '08.05.2026',
    view: 980,
    slug: {
      az: 'azerbaycan-metbexi-plov',
      en: 'azerbaijani-cuisine-plov',
      ru: 'azerbaydzhanskaya-kuhnya-plov',
    },
    title: {
      az: 'Azərbaycan mətbəxinin incisi: Plov',
      en: 'The jewel of Azerbaijani cuisine: Plov',
      ru: 'Жемчужина азербайджанской кухни: плов',
    },
    description: {
      az: '<p>Plov Azərbaycan süfrəsinin baş tacıdır. 40-dan çox növü olan bu yemək toy, bayram və xüsusi günlərin ayrılmaz hissəsidir.</p><p>Düyünün ayrı, ətin və ya quş ətinin ayrı bişirilməsi, üstünə qızılı qazmağın əlavə olunması plovu əsl sənət əsərinə çevirir. Hər regionun öz reseptі və dadı var.</p>',
      en: '<p>Plov is the crown of the Azerbaijani table. With more than 40 varieties, this dish is an inseparable part of weddings, holidays and special days.</p><p>Cooking the rice separately from the meat or poultry, then adding the golden “gazmag” crust, turns plov into a true work of art. Every region has its own recipe and flavour.</p>',
      ru: '<p>Плов — корона азербайджанского стола. Имея более 40 разновидностей, это блюдо неотделимо от свадеб, праздников и особых дней.</p><p>Рис, приготовленный отдельно от мяса или птицы, и золотистая корочка «газмаг» превращают плов в настоящее произведение искусства. У каждого региона свой рецепт и вкус.</p>',
    },
  },
  {
    id: 3,
    image: IMG('photo-1414235077428-338989a2e8c0'),
    date: '03.05.2026',
    view: 1530,
    slug: {
      az: 'masa-rezerv-etmeyin-sirleri',
      en: 'secrets-of-booking-a-table',
      ru: 'sekrety-bronirovaniya-stolika',
    },
    title: {
      az: 'Restoranda masa rezerv etməyin sirləri',
      en: 'The secrets of booking a restaurant table',
      ru: 'Секреты бронирования столика в ресторане',
    },
    description: {
      az: '<p>Yaxşı bir axşam üçün düzgün masanı seçmək yarı uğurdur. Rezervasiyanı erkən etmək, xüsusi tələbləri (ad günü, pəncərə kənarı, sakit guşə) əvvəlcədən bildirmək təcrübənizi tamamilə dəyişir.</p><p>Onlayn rezervasiya platformaları artıq telefon zənglərini lazımsız edir — bir neçə kliklə boş masanı görüb ani təsdiq ala bilərsiniz.</p>',
      en: '<p>Choosing the right table is half the success of a great evening. Booking early and stating special requests in advance (a birthday, a spot by the window, a quiet corner) completely changes your experience.</p><p>Online booking platforms have made phone calls unnecessary — in a few clicks you can see free tables and get instant confirmation.</p>',
      ru: '<p>Правильно выбранный столик — половина успеха хорошего вечера. Ранее бронирование и заранее озвученные пожелания (день рождения, место у окна, тихий уголок) полностью меняют впечатление.</p><p>Онлайн-платформы бронирования сделали телефонные звонки ненужными — за несколько кликов вы видите свободные столики и получаете мгновенное подтверждение.</p>',
    },
  },
  {
    id: 4,
    image: IMG('photo-1529692236671-f1f6cf9683ba'),
    date: '28.04.2026',
    view: 870,
    slug: {
      az: 'kababin-tarixi-ve-novleri',
      en: 'history-and-types-of-kebab',
      ru: 'istoriya-i-vidy-kebaba',
    },
    title: {
      az: 'Kababın tarixi və növləri',
      en: 'The history and types of kebab',
      ru: 'История и виды кебаба',
    },
    description: {
      az: '<p>Mangalda bişən ət qoxusu Azərbaycan yay axşamlarının simvoludur. Tikə, lülə, qanqal, balıq kababı — hər biri ayrı bir dad dünyasıdır.</p><p>Əsl kababın sirri keyfiyyətli ətdə, düzgün marinadda və közün hərarətindədir. Bu yazıda kababın növləri və onları harada dadmaq lazım olduğunu danışırıq.</p>',
      en: '<p>The smell of meat grilling over coals is a symbol of Azerbaijani summer evenings. Tika, lula, fish kebab — each is its own world of flavour.</p><p>The secret of a real kebab lies in quality meat, the right marinade and the heat of the coals. In this article we cover the types of kebab and where to taste them.</p>',
      ru: '<p>Запах мяса на углях — символ азербайджанских летних вечеров. Тика, люля, рыбный кебаб — каждый из них отдельный мир вкуса.</p><p>Секрет настоящего кебаба — в качественном мясе, правильном маринаде и жаре углей. В этой статье мы рассказываем о видах кебаба и о том, где их попробовать.</p>',
    },
  },
  {
    id: 5,
    image: IMG('photo-1551632436-cbf8dd35adfa'),
    date: '22.04.2026',
    view: 2010,
    slug: {
      az: 'romantik-sam-yemeyi-mekanlari',
      en: 'best-spots-for-a-romantic-dinner',
      ru: 'mesta-dlya-romanticheskogo-uzhina',
    },
    title: {
      az: 'Romantik şam yeməyi üçün ən yaxşı məkanlar',
      en: 'The best spots for a romantic dinner',
      ru: 'Лучшие места для романтического ужина',
    },
    description: {
      az: '<p>Xüsusi bir axşam üçün atmosfer yeməkdən az əhəmiyyətli deyil. Şəhərin işıqlarına baxan teras, yumşaq musiqi və diqqətli xidmət anı unudulmaz edir.</p><p>Sevgililər günü, ad günü və ya sadəcə “heç bir səbəbsiz” bir görüş üçün ən yaxşı romantik məkanları seçdik.</p>',
      en: '<p>For a special evening the atmosphere matters no less than the food. A terrace overlooking the city lights, soft music and attentive service make the moment unforgettable.</p><p>We have picked the best romantic venues for Valentine’s Day, a birthday, or simply a date with “no reason at all”.</p>',
      ru: '<p>Для особенного вечера атмосфера важна не меньше еды. Терраса с видом на огни города, тихая музыка и внимательный сервис делают момент незабываемым.</p><p>Мы выбрали лучшие романтические места для Дня святого Валентина, дня рождения или свидания просто «без повода».</p>',
    },
  },
  {
    id: 6,
    image: IMG('photo-1533920379810-6bedac961555'),
    date: '16.04.2026',
    view: 760,
    slug: {
      az: 'bakida-brunch-medeniyyeti',
      en: 'brunch-culture-in-baku',
      ru: 'kultura-brancha-v-baku',
    },
    title: {
      az: 'Bakıda brunch mədəniyyəti',
      en: 'Brunch culture in Baku',
      ru: 'Культура бранча в Баку',
    },
    description: {
      az: '<p>Səhər yeməyi ilə naharın qovşağı olan brunch artıq Bakıda da sevilən bir ənənəyə çevrilib. Tələsməyən, dostlarla söhbətli bir həftə sonu başlanğıcı.</p><p>Avokadolu tost, omlet, təzə sıxılmış şirələr və xüsusi qəhvə — şəhərin ən yaxşı brunch menyularını bu yazıda tapacaqsınız.</p>',
      en: '<p>Brunch, the crossroads of breakfast and lunch, has become a beloved tradition in Baku too. An unhurried weekend start full of conversation with friends.</p><p>Avocado toast, omelettes, freshly squeezed juices and specialty coffee — find the city’s best brunch menus in this article.</p>',
      ru: '<p>Бранч — перекрёсток завтрака и обеда — стал любимой традицией и в Баку. Неспешное начало выходного дня в компании друзей.</p><p>Тост с авокадо, омлеты, свежевыжатые соки и спешелти-кофе — лучшие бранч-меню города вы найдёте в этой статье.</p>',
    },
  },
  {
    id: 7,
    image: IMG('photo-1512621776951-a57141f2eefd'),
    date: '10.04.2026',
    view: 640,
    slug: {
      az: 'vegetarian-ve-vegan-restoranlar',
      en: 'vegetarian-and-vegan-restaurants',
      ru: 'vegetarianskie-i-veganskie-restorany',
    },
    title: {
      az: 'Vegetarian və vegan restoranlar bələdçisi',
      en: 'A guide to vegetarian and vegan restaurants',
      ru: 'Гид по вегетарианским и веганским ресторанам',
    },
    description: {
      az: '<p>Bitki əsaslı qidalanma artıq sadəcə trend deyil, həyat tərzidir. Bakıda da menyusunda zəngin vegetarian və vegan seçimləri olan məkanların sayı sürətlə artır.</p><p>Tərəvəz kababından humusa, kişmişli pilavdan bitki əsaslı desertlərə qədər — hər kəs üçün dadlı və sağlam variantlar mövcuddur.</p>',
      en: '<p>Plant-based eating is no longer just a trend but a lifestyle. In Baku, too, the number of venues with rich vegetarian and vegan options is growing fast.</p><p>From vegetable kebab to hummus, from raisin pilaf to plant-based desserts — there are tasty and healthy options for everyone.</p>',
      ru: '<p>Растительное питание уже не просто тренд, а образ жизни. В Баку тоже быстро растёт число заведений с богатым выбором вегетарианских и веганских блюд.</p><p>От овощного кебаба до хумуса, от плова с изюмом до растительных десертов — вкусные и полезные варианты найдутся для каждого.</p>',
    },
  },
  {
    id: 8,
    image: IMG('photo-1519676867240-f03562e64548'),
    date: '04.04.2026',
    view: 1120,
    slug: {
      az: 'serq-sirniyyatlari-paxlava',
      en: 'eastern-sweets-baklava',
      ru: 'vostochnye-sladosti-pahlava',
    },
    title: {
      az: 'Şərq şirniyyatları: Paxlava və daha çox',
      en: 'Eastern sweets: Baklava and beyond',
      ru: 'Восточные сладости: пахлава и не только',
    },
    description: {
      az: '<p>Novruz süfrəsinin bəzəyi olan paxlava, şəkərbura və şəkərçörəyi əsrlərdir ki, qonaqpərvərliyin simvoludur. Qoz, fındıq, bal və zəfəranın incə harmoniyası.</p><p>Bu şirniyyatların tarixini, hazırlanma incəliklərini və onları ən yaxşı dadacağınız çayxana və restoranları təqdim edirik.</p>',
      en: '<p>Baklava, shakarbura and shakarchorek — the decoration of the Novruz table — have been symbols of hospitality for centuries. A delicate harmony of walnuts, hazelnuts, honey and saffron.</p><p>We present the history of these sweets, the subtleties of making them, and the teahouses and restaurants where you can taste them best.</p>',
      ru: '<p>Пахлава, шекербура и шекерчорек — украшение новрузского стола — веками являются символами гостеприимства. Тонкая гармония грецких орехов, фундука, мёда и шафрана.</p><p>Мы рассказываем историю этих сладостей, тонкости их приготовления и чайханы и рестораны, где их лучше всего попробовать.</p>',
    },
  },
  {
    id: 9,
    image: IMG('photo-1467003909585-2f8a72700288'),
    date: '29.03.2026',
    view: 890,
    slug: {
      az: 'deniz-mehsullari-restoranlari',
      en: 'seafood-restaurants-guide',
      ru: 'gid-po-rybnym-restoranam',
    },
    title: {
      az: 'Dəniz məhsulları restoranları bələdçisi',
      en: 'A guide to seafood restaurants',
      ru: 'Гид по рыбным ресторанам',
    },
    description: {
      az: '<p>Xəzərin sahilində yerləşən şəhər üçün təzə balıq və dəniz məhsulları xüsusi yer tutur. Naxçıvan balığından kütümə qədər zəngin seçim var.</p><p>Təzə tutulmuş balığın közdə bişirilməsi, sadə zeytun yağı və limonla təqdim olunması — əsl dadın sirri məhz sadəlikdədir.</p>',
      en: '<p>For a city on the shore of the Caspian, fresh fish and seafood hold a special place. There is a rich choice, from sturgeon to kutum.</p><p>Freshly caught fish grilled over coals and served simply with olive oil and lemon — the secret of true flavour lies exactly in this simplicity.</p>',
      ru: '<p>Для города на берегу Каспия свежая рыба и морепродукты занимают особое место. Богатый выбор — от осетра до кутума.</p><p>Свежевыловленная рыба на углях, поданная просто с оливковым маслом и лимоном, — секрет настоящего вкуса именно в этой простоте.</p>',
    },
  },
  {
    id: 10,
    image: IMG('photo-1576092768241-dec231879fc3'),
    date: '24.03.2026',
    view: 1340,
    slug: {
      az: 'cay-medeniyyeti-ve-cayxanalar',
      en: 'tea-culture-and-teahouses',
      ru: 'chaynaya-kultura-i-chayhany',
    },
    title: {
      az: 'Çay mədəniyyəti və Azərbaycan çayxanaları',
      en: 'Tea culture and Azerbaijani teahouses',
      ru: 'Чайная культура и азербайджанские чайханы',
    },
    description: {
      az: '<p>Azərbaycanda çay sadəcə içki deyil — söhbətin, qonaqpərvərliyin və istirahətin dilidir. Armudu stəkanda dəmlənmiş tünd çay, mürəbbə və şirniyyat ilə təqdim olunur.</p><p>Şəhərin küncündəki ənənəvi çayxanalardan müasir çay evlərinə qədər — çay mərasiminin ən gözəl ünvanlarını topladıq.</p>',
      en: '<p>In Azerbaijan tea is not just a drink — it is the language of conversation, hospitality and rest. Strong tea brewed in a pear-shaped “armudu” glass is served with jam and sweets.</p><p>From traditional teahouses on a city corner to modern tea rooms — we have gathered the finest addresses for the tea ceremony.</p>',
      ru: '<p>В Азербайджане чай — не просто напиток, а язык беседы, гостеприимства и отдыха. Крепкий чай, заваренный в грушевидном стакане «армуду», подают с вареньем и сладостями.</p><p>От традиционных чайхан на углу города до современных чайных — мы собрали лучшие адреса для чайной церемонии.</p>',
    },
  },
];

const normalizeLang = (lang: string): Lang =>
  (['az', 'en', 'ru'].includes(lang) ? lang : 'az') as Lang;

const toBlogItem = (b: StaticBlog, l: Lang): BlogItem => ({
  id: b.id,
  title: b.title[l],
  description: b.description[l],
  seo_title: b.title[l],
  seo_description: null,
  image: b.image,
  view: b.view,
  date: b.date,
  slug: b.slug,
});

export function getStaticBlogs(lang: string): BlogItem[] {
  const l = normalizeLang(lang);
  return blogs.map((b) => toBlogItem(b, l));
}

export function getStaticBlog(slug: string, lang: string): BlogItem | undefined {
  const l = normalizeLang(lang);
  const found = blogs.find((b) =>
    [b.slug.az, b.slug.en, b.slug.ru].includes(slug),
  );
  return found ? toBlogItem(found, l) : undefined;
}

export function getSimilarStaticBlogs(
  slug: string,
  lang: string,
  count = 3,
): BlogItem[] {
  const l = normalizeLang(lang);
  return blogs
    .filter((b) => ![b.slug.az, b.slug.en, b.slug.ru].includes(slug))
    .slice(0, count)
    .map((b) => toBlogItem(b, l));
}
