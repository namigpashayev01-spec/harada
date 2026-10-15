import type { TranslationKey } from './az';

/** English. Typed against `az.ts` — a missing key is a type error. */
export const en: Record<TranslationKey, string> = {
  /* ---------------------------------------------------------------- common */
  'common.all': 'All',
  'common.seeAll': 'See all',
  'common.close': 'Close',
  'common.category': 'Category',
  'common.property': 'Feature',
  'common.restaurant': 'Restaurant',
  'common.blog': 'Blog',
  'common.article': 'Article',
  'common.scrollLeft': 'Scroll left',
  'common.scrollRight': 'Scroll right',

  /* ------------------------------------------------------------ navigation */
  'nav.home': 'Home',
  'nav.homeShort': 'Home',
  'nav.about': 'About Us',
  'nav.places': 'Places',
  'nav.blog': 'Blog',
  'nav.contact': 'Contact',
  'nav.account': 'Account',
  'nav.login': 'Log in',
  'nav.loginShort': 'Log in',
  'nav.register': 'Sign up',
  'nav.logout': 'Log out',
  'nav.favorites': 'Favorites',
  'nav.reviews': 'Reviews',
  'nav.reservations': 'Reservations',
  'nav.profileSettings': 'Profile settings',
  'nav.more': 'More',
  'nav.pages': 'Pages',
  'nav.language': 'Language',

  /* ---------------------------------------------------------------- footer */
  'footer.getStarted': "Let's get started",
  'footer.registerRestaurant': 'List my restaurant',
  // One label sits above both "App Store" and "Google Play", so it stays generic.
  'footer.download': 'Download',
  'footer.copyright': 'Copyright © {year}. All rights reserved.',
  'footer.countries': 'Countries',
  'footer.privacy': 'Privacy Policy',
  'privacy.updated': 'Last updated: {date}',

  /* ------------------------------------------------------------------ hero */
  'hero.badge': "Baku's best tables",
  'hero.titleLine1': 'Find the best restaurant',
  'hero.titleLine2': 'in Baku and book a table',
  'hero.subtitle':
    'Search by district or cuisine and book your table in seconds — free, with instant confirmation.',
  'hero.imageAlt': 'Restaurants in Baku',

  /* ---------------------------------------------------------------- search */
  'search.locationPlaceholder': 'District / Metro',
  'search.queryPlaceholder': 'Cuisine, restaurant name...',
  'search.mobilePlaceholder': 'Search restaurants or cuisines',
  'search.searching': 'Searching…',
  'search.noResults': 'No results found',
  'search.submit': 'SEARCH',
  'search.submitShort': 'Search',
  'search.myLocation': 'My location',
  'search.locating': 'Finding your location…',
  'search.usingMyLocation': 'My location (nearest first)',
  'search.geoDenied': 'Location access is blocked. Tap the lock icon in your browser address bar, allow "Location", then try again.',
  'search.geoUnsupported': 'This browser does not support location.',
  'search.cuisines': 'Cuisines',
  'search.restaurants': 'Restaurants',
  'search.cuisineCount': 'places',
  'search.dishes': 'Dishes',
  'search.dishCount': 'places serve it',
  'search.hint': 'Enter a location, then a cuisine or restaurant — then press SEARCH.',

  /* --------------------------------------------------------------- filters */
  'filter.trigger': 'Filter',
  'filter.title': 'Filters',
  'filter.subtitle': 'Cuisine, venue type and offers',
  'filter.offers': 'Offers',
  'filter.offer': 'Special offer',
  'filter.clear': 'Clear',
  'filter.clearCount': 'Clear ({n})',
  'filter.clearAll': 'Clear all',
  'filter.apply': 'Show results',
  'filter.loading': 'Loading filters...',
  'filter.labelInline': 'Filters:',
  'filter.activeLabel': 'Active filters:',

  /* ------------------------------------------------------------- home page */
  'home.categories.title': 'Browse by cuisine',
  'home.categories.subtitle': 'What do you feel like eating today?',

  'home.popular.title': 'Popular restaurants',
  'home.popular.subtitle': 'The places people in Baku love to book',

  'home.offers.badge': 'Deals',
  'home.offers.title': 'Best offers',
  'home.offers.subtitle': 'Discounted tables — book and save',
  'home.offers.promoBadge': 'Discount',
  'home.offers.promoTitle': 'Up to 30% off',
  'home.offers.promoSubtitle': 'Special offers at selected restaurants',
  'home.offers.cta': 'View offers',

  'home.campaign.badge': 'Featured restaurant',
  'home.campaign.title': "Discover the city's finest restaurant",
  'home.campaign.subtitle':
    'Enjoy special offers at selected restaurants and book your table now.',
  'home.campaign.value': '20% off',
  'home.campaign.button': 'Book now',

  'home.blog.title': 'From our blog',
  'home.blog.subtitle': 'Tips from the table, guides and stories',

  /* ------------------------------------------------------- restaurant card */
  'card.topBadge': 'Top 10 Baku',
  'card.offerBadge': 'Offer',
  'card.reviewCount': '({n} reviews)',
  'card.discount': '−{percent}% off',
  'card.distanceAway': '{km} km away',
  'card.viewDetails': 'View details',

  /* ----------------------------------------------------------- places page */
  'places.bannerAlt': 'Food banner',
  'places.resultsFor': 'Results for "{query}"',
  'places.inSelectedArea': 'Restaurants in the selected area',
  'places.nearby': 'Restaurants nearby',
  'places.restaurantCount': '{n} restaurants',
  'places.locationError':
    'Location access is blocked, so we are showing restaurants in central Baku. To see the closest places, tap the lock icon in your browser address bar, allow "Location", then reload the page.',
  'places.showList': 'Show list',
  'places.showMap': 'Show on map',
  'places.closeMap': 'Close map',
  'places.empty': 'No restaurants found. Try changing the filters.',
  'places.resetFilters': 'Reset filters',

  /* ------------------------------------------------------------------- map */
  'map.openInGoogleMaps': 'Open in Google Maps',

  /* ------------------------------------------------------------------- SEO */
  'seo.home.title': 'Harada Oturaq — Restaurants, Booking and Discounts',
  'seo.home.description':
    'Find the best restaurants near you, browse menus and prices, book a table online and enjoy exclusive discounts.',

  'seo.places.title': 'Restaurants — Places to eat nearby | Harada Oturaq',
  'seo.places.description':
    'Find restaurants near you on the map; filter by cuisine, price and features to pick the perfect meal.',

  'seo.about.title': 'About Us — Harada Oturaq',
  'seo.about.description':
    'Harada Oturaq is a restaurant discovery platform. We help you find the best places to eat near you with ease.',

  'seo.contact.title': 'Contact — Get in touch | Harada Oturaq',
  'seo.contact.description':
    'Contact the Harada Oturaq team with questions, suggestions or partnership ideas. Send a message and we will reply shortly.',

  'seo.restaurantRegister.title': 'List your restaurant | Harada Oturaq',
  'seo.restaurantRegister.description':
    'Add your restaurant to Harada Oturaq, reach new customers and start accepting online reservations.',

  'seo.place.description':
    '{title} — address, menu, prices and reviews. Book online with {brand}.',
  'seo.place.fallbackDescription':
    'Full details about the restaurant: address, menu, prices and reviews. Book online.',

  'seo.blog.description': '{title} — read it on the {brand} blog.',
  'seo.blog.fallbackDescription':
    'An article about restaurants and food. Read it on the Harada Oturaq blog.',

  'seo.dashboard.title': 'My account — Harada Oturaq',
  'seo.dashboard.description':
    'Your personal dashboard: manage your reservations, favorite restaurants and reviews.',

  'seo.login.title': 'Log in — Harada Oturaq',
  'seo.login.description':
    'Log in to your Harada Oturaq account to manage your favorite restaurants and reservations.',

  'seo.register.title': 'Sign up — Harada Oturaq',
  'seo.register.description':
    'Create a free Harada Oturaq account to discover restaurants, book tables and save your favorites.',

  /* ------------------------------------------------------------ menu SEO */
  'seo.menu.title': '{name} Menu & Prices',
  'seo.menu.titleShort': '{name} Menu',
  'seo.menu.dishesOne': '{n} dish',
  'seo.menu.dishesFew': '{n} dishes',
  'seo.menu.dishesMany': '{n} dishes',
  'seo.menu.lead': '{name} menu: {dishes}',
  'seo.menu.leadNoCount': '{name} menu',
  'seo.menu.priceRange': 'prices {min}–{max} ₼',
  'seo.menu.pricesFrom': 'prices from {min} ₼',
  'seo.menu.cta': 'Book a table online — free.',
  'seo.menu.fallbackDescription': 'Restaurant menu: dishes, prices and photos. Book a table online.',
  'menu.subtitle': '{dishes} · {prices}',
  'menu.sectionCount': '{n} sections',

  /* ------------------------------------------------------- taxonomy pages */
  'tax.cuisine.heading': '{name} restaurants in Baku',
  'tax.category.heading': '{name} places in Baku',
  'tax.district.heading': 'Restaurants in {name} district',
  'tax.cuisine.lead': '{count} places serving {name} in Baku. Menus, prices, opening hours and online booking.',
  'tax.category.lead': '{count} places for {name} in Baku. Menus, prices, opening hours and online booking.',
  'tax.district.lead': '{count} restaurants and cafes in {name} district. Menus, prices, opening hours and online booking.',
  'tax.cuisine.title': '{name} restaurants in Baku',
  'tax.category.title': '{name} — best places in Baku',
  'tax.district.title': 'Restaurants in {name} district',
  'tax.index.cuisines': 'Cuisines',
  'tax.index.categories': 'Categories',
  'tax.index.districts': 'Districts',
  'tax.index.cuisines.lead': 'Browse restaurants in Baku by cuisine.',
  'tax.index.categories.lead': 'Browse places in Baku by category.',
  'tax.index.districts.lead': 'Browse restaurants by district.',
  'tax.count': '{n} places',
  'tax.empty': 'No places here yet.',
  'tax.browseOther': 'Browse more',
  'tax.allPlaces': 'All restaurants',
  'tax.page': 'Page {n}',
  'tax.prev': 'Previous',
  'tax.next': 'Next',
  'tax.city.heading': 'Restaurants in {name}',
  'tax.city.title': 'Restaurants in {name} — Addresses & Hours | Harada Oturaq',
  'tax.city.lead': '{count} restaurants and cafés in {name} — addresses, opening hours, phone numbers and cuisines in one place.',
  'tax.index.cities': 'Restaurants abroad',
  'tax.index.cities.lead': 'Pick a city — addresses, opening hours and phone numbers.',
  'hub.uz.badge': "Uzbekistan's best tables",
  'hub.uz.line1': "Find the best restaurant",
  'hub.uz.line2': "in Uzbekistan and book a table",
  'tax.index.cities.uz': 'Restaurants in Uzbekistan',
  'tax.index.cities.uz.lead': 'Pick a city to browse restaurants in Uzbekistan — addresses, opening hours and phone numbers.',
  'hub.ca.badge': "Canada's best tables",
  'hub.ca.line1': "Find the best restaurant",
  'hub.ca.line2': "in Canada and book a table",
  'tax.index.cities.ca': 'Restaurants in Canada',
  'tax.index.cities.ca.lead': 'Pick a city to browse restaurants in Canada — addresses, opening hours and phone numbers.',
  'hub.nl.badge': "The best tables in the Netherlands",
  'hub.nl.line1': "Find the best restaurant",
  'hub.nl.line2': "in the Netherlands and book a table",
  'tax.index.cities.nl': 'Restaurants in the Netherlands',
  'tax.index.cities.nl.lead': 'Pick a city to browse restaurants in the Netherlands — addresses, opening hours and phone numbers.',
  'hub.rs.badge': "Serbia's best tables",
  'hub.rs.line1': "Find the best restaurant",
  'hub.rs.line2': "in Serbia and book a table",
  'tax.index.cities.rs': 'Restaurants in Serbia',
  'tax.index.cities.rs.lead': 'Pick a city to browse restaurants in Serbia — addresses, opening hours and phone numbers.',
  'hub.lv.badge': "Latvia's best tables",
  'hub.lv.line1': "Find the best restaurant",
  'hub.lv.line2': "in Latvia and book a table",
  'tax.index.cities.lv': 'Restaurants in Latvia',
  'tax.index.cities.lv.lead': 'Pick a city to browse restaurants in Latvia — addresses, opening hours and phone numbers.',

};
