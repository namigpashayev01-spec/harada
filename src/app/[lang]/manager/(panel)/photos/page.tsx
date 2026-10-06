'use client';

import { useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, UploadCloud, Trash2, Star, Hourglass, ImageOff } from 'lucide-react';
import ownerService from '@/services/owner.service';
import { useManager } from '@/components/Manager/ManagerShell';
import { managerDict } from '@/components/Manager/dict';

const L: Record<string, Record<string, string>> = {
  az: {
    title: 'Şəkillər',
    subtitle:
      'Yüklədiyiniz şəkillər yoxlanışdan sonra saytda görünür. Örtük şəklini təsdiqlənmiş şəkillərdən özünüz seçə bilərsiniz.',
    upload: 'Şəkil yüklə',
    uploading: 'Yüklənir…',
    dropHint: 'JPG, PNG və ya WEBP · hər biri ən çox 5 MB · bir dəfəyə 10 şəkil',
    empty: 'Hələ şəkil yoxdur. İlk şəkli yükləyin.',
    pending: 'Təsdiq gözləyir',
    cover: 'Örtük şəkli',
    makeCover: 'Örtük et',
    limitReached: 'Şəkil limitinə çatmısınız.',
    ofLimit: 'şəkildən',
    coverOnlyApproved: 'Örtük üçün yalnız təsdiqlənmiş şəkil seçilə bilər.',
  },
  en: {
    title: 'Photos',
    subtitle:
      'Uploaded photos appear on the site after review. You can pick the cover yourself from approved photos.',
    upload: 'Upload photos',
    uploading: 'Uploading…',
    dropHint: 'JPG, PNG or WEBP · up to 5 MB each · 10 photos at a time',
    empty: 'No photos yet. Upload the first one.',
    pending: 'Awaiting approval',
    cover: 'Cover photo',
    makeCover: 'Make cover',
    limitReached: 'You have reached the photo limit.',
    ofLimit: 'of',
    coverOnlyApproved: 'Only an approved photo can be used as the cover.',
  },
  ru: {
    title: 'Фотографии',
    subtitle:
      'Загруженные фото появляются на сайте после проверки. Обложку можно выбрать самостоятельно из одобренных фото.',
    upload: 'Загрузить фото',
    uploading: 'Загрузка…',
    dropHint: 'JPG, PNG или WEBP · до 5 МБ каждое · 10 фото за раз',
    empty: 'Фотографий пока нет. Загрузите первую.',
    pending: 'Ждёт одобрения',
    cover: 'Обложка',
    makeCover: 'Сделать обложкой',
    limitReached: 'Достигнут лимит фотографий.',
    ofLimit: 'из',
    coverOnlyApproved: 'Обложкой можно сделать только одобренное фото.',
  },
};

export default function ManagerPhotosPage() {
  const { restaurant, lang } = useManager();
  const t = managerDict(lang);
  const l = L[lang] ?? L.az;
  const queryClient = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['owner', 'photos', restaurant.id],
    queryFn: () => ownerService.getPhotos(restaurant.id),
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ['owner', 'photos', restaurant.id] });

  const photos = data?.data ?? [];
  const limit = data?.limit ?? 30;
  const full = photos.length >= limit;

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await ownerService.uploadPhotos(
        restaurant.id,
        Array.from(files).slice(0, 10),
      );
      setMessage(
        (res as { message?: string })?.message ?? null,
      );
      refresh();
    } catch (err: unknown) {
      const serverMessage = (
        err as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      setError(serverMessage || t.failed);
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const remove = async (id: number) => {
    if (!confirm(t.confirmDelete)) return;
    setError(null);
    try {
      await ownerService.deletePhoto(restaurant.id, id);
      refresh();
    } catch {
      setError(t.failed);
    }
  };

  const makeCover = async (id: number, approved: boolean) => {
    if (!approved) {
      setError(l.coverOnlyApproved);
      return;
    }
    setError(null);
    try {
      await ownerService.setCover(restaurant.id, id);
      refresh();
    } catch {
      setError(t.failed);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{l.title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">{l.subtitle}</p>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center">
        <UploadCloud className="mx-auto h-8 w-8 text-gray-300" />
        <p className="mt-2 text-xs text-gray-400">{l.dropHint}</p>
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />
        <button
          type="button"
          disabled={busy || full}
          onClick={() => fileInput.current?.click()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#006653] px-4 py-2 text-sm font-medium text-white hover:bg-[#00543f] disabled:opacity-50">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {busy ? l.uploading : l.upload}
        </button>
        <p className="mt-2 text-xs text-gray-400">
          {photos.length} {l.ofLimit} {limit}
        </p>
        {full && <p className="mt-1 text-xs text-amber-600">{l.limitReached}</p>}
      </div>

      {message && (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>
      )}
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : photos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          <ImageOff className="mx-auto mb-2 h-6 w-6 text-gray-300" />
          {l.empty}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((p) => (
            <div
              key={p.id}
              className="overflow-hidden rounded-xl border border-gray-100 bg-white">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt=""
                  loading="lazy"
                  className={`h-36 w-full object-cover ${
                    p.approved ? '' : 'opacity-70'
                  }`}
                />
                {p.is_cover && (
                  <span className="absolute left-2 top-2 rounded-full bg-[#006653] px-2 py-0.5 text-[10px] font-medium text-white">
                    {l.cover}
                  </span>
                )}
                {!p.approved && (
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-medium text-white">
                    <Hourglass className="h-3 w-3" />
                    {l.pending}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 p-2">
                <button
                  type="button"
                  onClick={() => makeCover(p.id, p.approved)}
                  disabled={p.is_cover}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#006653] disabled:text-gray-300">
                  <Star className={`h-3.5 w-3.5 ${p.is_cover ? 'fill-[#006653]' : ''}`} />
                  {l.makeCover}
                </button>
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  className="text-gray-400 hover:text-red-600"
                  aria-label={t.delete}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
