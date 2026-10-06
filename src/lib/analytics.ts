// GA4 user_id izləməsi — məlumat dataLayer-ə yazılır, oradan GTM götürüb
// GA4-ə ötürür. Buraya YALNIZ daxili istifadəçi nömrəsi düşür; e-poçt, ad,
// telefon kimi şəxsi məlumatların GA4-ə göndərilməsi Google qaydalarına ziddir.

const USER_ID_KEY = 'diny_user_id';

type DataLayerEvent = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

const push = (event: DataLayerEvent) => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
};

/**
 * Hadisəni dataLayer-ə yazır. Şəxsi məlumat (ad, telefon, e-poçt) BURAYA
 * qoyulmamalıdır — yalnız ölçü üçün lazım olan sahələr.
 */
export const pushEvent = (event: DataLayerEvent) => push(event);

/** Səhifə ilk açılanda dataLayer-i doldurmaq üçün saxlanılan nömrə. */
export const getStoredUserId = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(USER_ID_KEY);
  } catch {
    return null;
  }
};

/**
 * İstifadəçini analitikaya tanıdır.
 *
 * `event` verilsə (login / sign_up), GTM-də həmin adda trigger işə düşür —
 * bu, səhifə yenilənmədən daxil olan istifadəçi üçün vacibdir, çünki GA4-ün
 * əsas tag-ı yalnız səhifə açılışında bir dəfə işləyir.
 */
export function identifyUser(
  user: { id: number | string },
  event?: 'login' | 'sign_up',
) {
  const userId = String(user.id);
  try {
    window.localStorage.setItem(USER_ID_KEY, userId);
  } catch {
    // localStorage bağlıdırsa (gizli rejim), yalnız cari səhifə üçün işləyəcək
  }
  push({ event: event ?? 'user_identified', user_id: userId });
}

/** Çıxışdan sonra nömrəni silir ki, növbəti ziyarət anonim sayılsın. */
export function clearUser() {
  try {
    window.localStorage.removeItem(USER_ID_KEY);
  } catch {
    // yuxarıdakı ilə eyni hal
  }
  push({ event: 'logout', user_id: undefined });
}
