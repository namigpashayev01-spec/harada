#!/usr/bin/env bash
#
# harada-oturaq.az — təhlükəsiz yayım.
#
# NİYƏ LAZIMDIR: `next build` yazacağı qovluğu əvvəlcə tamamilə silir. Canlı
# `.next` qovluğunun üstündə build etsən, sayt build boyu sınıq qalır — və
# build bitəndən sonra da sınıq qalır, çünki işləyən proses artıq silinmiş JS
# fayllarının adlarını yadda saxlayıb. (2026-09-21: səhifələr 200 qaytarırdı,
# amma brauzerdə JS yüklənmirdi — `9072-dcf18b….js` 400 verirdi.)
#
# Bu skript build-i AYRI qovluqda edir, yalnız build uğurlu olanda qovluğu
# yerinə keçirir, prosesi yenidən başladır, sonra saytı yoxlayır. Yoxlama
# kəsilsə, köhnə build-i avtomatik geri qaytarır.
#
# İstifadə:
#   bash /var/www/harada-oturaq/scripts/deploy.sh
#   bash /var/www/harada-oturaq/scripts/deploy.sh --install   # npm install da et
#
set -euo pipefail

APP="harada-oturaq"
ROOT="/var/www/harada-oturaq"
PORT=3001

LIVE="$ROOT/.next"
BUILD="$ROOT/.next-build"
PREV="$ROOT/.next-prev"
LOCK="/var/lock/harada-deploy.lock"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Yoxlanacaq səhifələr. Restoran detalı ayrıca əlavə olunur (aşağıda), çünki
# onun ünvanı bazadan asılıdır və dəyişə bilər.
PAGES=(/az /en /ru /az/places /az/blog /az/contact)

say()  { printf '\n\033[1m▸ %s\033[0m\n' "$*"; }
ok()   { printf '  \033[32m✓\033[0m %s\n' "$*"; }
warn() { printf '  \033[33m!\033[0m %s\n' "$*"; }
die()  { printf '\n\033[31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

# İki yayım eyni anda getməsin — qovluq yerdəyişməsi yarıda qalardı.
exec 9>"$LOCK"
flock -n 9 || die "Başqa yayım artıq gedir. Gözlə və ya: rm -f $LOCK"

cd "$ROOT"

# ---------------------------------------------------------------- yoxlamalar
say "Hazırlıq yoxlanır"
[ -f package.json ] || die "package.json tapılmadı: $ROOT"
pm2 describe "$APP" >/dev/null 2>&1 || die "PM2-də '$APP' prosesi yoxdur"

# Bir build təxminən canlı qovluq qədər yer tutur; iki nüsxə saxlayırıq.
need_kb=$(( $(du -sk "$LIVE" 2>/dev/null | cut -f1 || echo 1000000) * 2 ))
free_kb=$(df -k --output=avail "$ROOT" | tail -1)
[ "$free_kb" -gt "$need_kb" ] || die "Disk yeri azdır (lazım ~$((need_kb/1024))MB, boş $((free_kb/1024))MB)"
ok "Disk və PM2 qaydasındadır"

if [ "${1:-}" = "--install" ]; then
  say "Asılılıqlar quraşdırılır"
  npm install --no-audit --no-fund
  ok "npm install bitdi"
fi

# ------------------------------------------------------------------- build
say "Build gedir (canlı sayta toxunmadan → .next-build)"
rm -rf "$BUILD"
if ! NEXT_DIST_DIR=.next-build npm run build 2>&1 | tail -25; then
  die "Build uğursuz oldu. Sayt TOXUNULMADI, köhnə versiya işləyir."
fi
[ -s "$BUILD/BUILD_ID" ] || die "Build natamamdır (BUILD_ID yoxdur). Sayt toxunulmadı."
ok "Build hazırdır: $(cat "$BUILD/BUILD_ID")"

# ----------------------------------------------------------- yerini dəyişmək
say "Yeni build yerinə keçirilir"
rm -rf "$PREV"
mv "$LIVE" "$PREV"
mv "$BUILD" "$LIVE"
ok "Köhnə build geri qaytarmaq üçün saxlanıldı: .next-prev"

restart_and_wait() {
  pm2 restart "$APP" >/dev/null
  # Proses qalxana qədər gözlə (ən çox 60 saniyə).
  for _ in $(seq 1 60); do
    if curl -sf -o /dev/null --max-time 5 "http://127.0.0.1:$PORT/az"; then return 0; fi
    sleep 1
  done
  return 1
}

say "Proses yenidən başladılır"
restart_and_wait || warn "Proses gec qalxdı — yoxlamaya baxaq"
ok "Proses cavab verir"

# ------------------------------------------------------------------ yoxlama
# Əsas məqam: səhifənin 200 qaytarması KİFAYƏT DEYİL. Səhifənin istədiyi hər
# JS faylının da yerində olduğunu yoxlayırıq — 2026-09-21-dəki nasazlıq məhz
# burada gizlənmişdi.
check_page() {
  local path="$1" code total=0 bad=0
  code=$(curl -s -o "$TMP/page.html" -w '%{http_code}' --max-time 25 "http://127.0.0.1:$PORT$path")
  if [ "$code" != "200" ]; then
    printf '  \033[31m✗\033[0m %-34s səhifə %s\n' "$path" "$code"
    return 1
  fi
  for c in $(grep -oE '/_next/static/[A-Za-z0-9_./-]+\.js' "$TMP/page.html" | sort -u); do
    total=$((total + 1))
    if [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "http://127.0.0.1:$PORT$c")" != "200" ]; then
      bad=$((bad + 1))
      printf '  \033[31m✗\033[0m %-34s sınıq JS: %s\n' "$path" "$c"
    fi
  done
  [ "$bad" -eq 0 ] || return 1
  printf '  \033[32m✓\033[0m %-34s 200, %s JS faylı bütöv\n' "$path" "$total"
}

say "Sayt yoxlanır"
# Restoran və menyu səhifələri ən çox JS yükləyən səhifələrdir, ona görə
# yoxlamaya mütləq düşməlidirlər. Ünvanları sitemap-dan götürürük: siyahı
# səhifəsi restoranları JS ilə gətirir, yəni server HTML-ində link olmur.
base_pages=${#PAGES[@]}
sitemap="$TMP/sitemap.xml"
curl -s --max-time 60 "http://127.0.0.1:$PORT/sitemap.xml" -o "$sitemap" || true
pick() { grep -oE "https?://[^<]*$1" "$sitemap" | head -1 | sed 's#https\?://[^/]*##'; }
for u in "$(pick '/az/places/[a-z0-9][a-z0-9-]*</')" "$(pick '/az/places/[a-z0-9-]*/menu</')"; do
  [ -n "$u" ] && PAGES+=("${u%<*}")
done
[ "${#PAGES[@]}" -gt "$base_pages" ] || warn "Sitemap-dan restoran ünvanı götürülmədi, yalnız əsas səhifələr yoxlanır"

failed=0
for p in "${PAGES[@]}"; do
  check_page "$p" || failed=$((failed + 1))
done

# --------------------------------------------------------------- geri qaytarma
if [ "$failed" -gt 0 ]; then
  say "YOXLAMA KƏSİLDİ ($failed səhifə) — köhnə build geri qaytarılır"
  rm -rf "$LIVE"
  mv "$PREV" "$LIVE"
  restart_and_wait || warn "Geri qaytarmadan sonra proses gec qalxdı"
  for p in "${PAGES[@]}"; do check_page "$p" || true; done
  die "Yayım geri qaytarıldı. Sayt köhnə versiya ilə işləyir. Səbəbi yuxarıdakı sətirlərdədir."
fi

say "Yayım uğurla bitdi"
ok "Build: $(cat "$LIVE/BUILD_ID")"
ok "Yoxlanan səhifə: ${#PAGES[@]}, sınıq: 0"
printf '\n  Geri qaytarmaq lazım olsa:\n    rm -rf %s && mv %s %s && pm2 restart %s\n\n' "$LIVE" "$PREV" "$LIVE" "$APP"
