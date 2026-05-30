'use client';

import { useRef, useState } from 'react';
import {
  Utensils,
  MapPin,
  ImagePlus,
  Phone,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  X,
  Check,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  BAKU_DISTRICTS,
  type RestaurantRegisterDict,
} from '@/components/RestaurantRegister/translations';

interface FormData {
  name: string;
  cuisine: string[];
  avgPrice: string;
  description: string;
  address: string;
  district: string;
  openFrom: string;
  openTo: string;
  mapLink: string;
  ownerName: string;
  phone: string;
  email: string;
  website: string;
}

const EMPTY: FormData = {
  name: '',
  cuisine: [],
  avgPrice: '',
  description: '',
  address: '',
  district: '',
  openFrom: '',
  openTo: '',
  mapLink: '',
  ownerName: '',
  phone: '',
  email: '',
  website: '',
};

const labelCls = 'mb-1.5 block text-sm font-medium text-gray-700';
const inputCls =
  'border-gray-200 focus-visible:border-[#006653] focus-visible:ring-[#006653]/20';
const selectCls =
  'flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-base md:text-sm text-gray-900 shadow-xs outline-none transition focus:border-[#006653] focus:ring-[3px] focus:ring-[#006653]/20';

const TOTAL_STEPS = 4;

export default function RestaurantRegisterForm({
  t,
}: {
  t: RestaurantRegisterDict;
}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(EMPTY);
  const [restaurantPhotos, setRestaurantPhotos] = useState<string[]>([]);
  const [menuPhotos, setMenuPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const steps = [
    { title: t.sectionInfo, icon: Utensils },
    { title: t.sectionLocation, icon: MapPin },
    { title: t.sectionPhotos, icon: ImagePlus },
    { title: t.sectionContact, icon: Phone },
  ];

  const update =
    (key: keyof FormData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setData((prev) => ({ ...prev, [key]: e.target.value }));

  const toggleCuisine = (c: string) =>
    setData((prev) => ({
      ...prev,
      cuisine: prev.cuisine.includes(c)
        ? prev.cuisine.filter((x) => x !== c)
        : [...prev.cuisine, c],
    }));

  const addPhotos = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    files: FileList | null,
  ) => {
    if (!files) return;
    const next = Array.from(files).map((f) => f.name);
    setter((prev) => [...prev, ...next].slice(0, 8));
  };

  const removePhoto = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    i: number,
  ) => setter((prev) => prev.filter((_, idx) => idx !== i));

  // Hər addım üçün məcburi sahələrin yoxlanması
  const isStepValid = (s: number): boolean => {
    switch (s) {
      case 0:
        return (
          !!data.name.trim() &&
          data.cuisine.length > 0 &&
          !!data.description.trim()
        );
      case 1:
        return (
          !!data.address.trim() &&
          !!data.district.trim() &&
          !!data.openFrom.trim() &&
          !!data.openTo.trim() &&
          !!data.mapLink.trim()
        );
      case 2:
        return restaurantPhotos.length > 0 && menuPhotos.length > 0;
      case 3:
        return (
          !!data.ownerName.trim() && !!data.phone.trim() && !!data.email.trim()
        );
      default:
        return true;
    }
  };

  const goNext = () => {
    if (!isStepValid(step)) {
      setError(t.requiredErr);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const goBack = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  // Stepper-dən yalnız tamamlanmış (və ya cari) addımlara keçidə icazə
  const goToStep = (target: number) => {
    if (target <= step) {
      setError(null);
      setStep(target);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Bütün addımları yoxla
    for (let s = 0; s < TOTAL_STEPS; s++) {
      if (!isStepValid(s)) {
        setStep(s);
        setError(t.requiredErr);
        return;
      }
    }

    setError(null);
    setIsSubmitting(true);
    // NOTE: Admin tərəfi hələ qurulmayıb. Backend hazır olanda müraciət
    // burada API-yə göndəriləcək. Hələlik uğurlu vəziyyət göstərilir.
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 600);
  };

  const resetForm = () => {
    setData(EMPTY);
    setRestaurantPhotos([]);
    setMenuPhotos([]);
    setSuccess(false);
    setError(null);
    setStep(0);
  };

  if (success) {
    return (
      <Card className="border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <CardContent className="flex flex-col items-center gap-4 px-6 py-14 text-center sm:px-10">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#9fe870]">
            <CheckCircle2 className="h-9 w-9 text-[#14532d]" />
          </span>
          <h3 className="text-2xl font-bold text-gray-900">{t.successTitle}</h3>
          <p className="max-w-md text-sm leading-relaxed text-gray-500">
            {t.successText}
          </p>
          <Button
            type="button"
            onClick={resetForm}
            className="mt-2 rounded-xl bg-[#006653] px-6 py-5 font-semibold text-white hover:bg-[#00543f]">
            {t.again}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <Stepper steps={steps} current={step} onSelect={goToStep} t={t} />

      <Card className="border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit}>
            {/* Addım 1 — Restoran haqqında */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className={labelCls}>
                    {t.name} <span className="text-[#006653]">*</span>
                  </label>
                  <Input
                    id="name"
                    className={inputCls}
                    placeholder={t.namePh}
                    value={data.name}
                    onChange={update('name')}
                  />
                </div>

                <div>
                  <label className={labelCls}>
                    {t.cuisine} <span className="text-[#006653]">*</span>
                  </label>
                  <p className="mb-2 text-xs text-gray-400">{t.cuisinePh}</p>
                  <div className="flex flex-wrap gap-2">
                    {t.cuisineOptions.map((c) => {
                      const active = data.cuisine.includes(c);
                      return (
                        <button
                          type="button"
                          key={c}
                          onClick={() => toggleCuisine(c)}
                          className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                            active
                              ? 'border-[#006653] bg-[#9fe870] text-[#14532d]'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-[#006653]/40'
                          }`}>
                          {active && <Check className="h-3.5 w-3.5" />}
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="avgPrice" className={labelCls}>
                    {t.avgPrice}{' '}
                    <span className="text-xs font-normal text-gray-400">
                      ({t.optional})
                    </span>
                  </label>
                  <Input
                    id="avgPrice"
                    type="number"
                    min={0}
                    className={inputCls}
                    placeholder={t.avgPricePh}
                    value={data.avgPrice}
                    onChange={update('avgPrice')}
                  />
                </div>

                <div>
                  <label htmlFor="description" className={labelCls}>
                    {t.description} <span className="text-[#006653]">*</span>
                  </label>
                  <Textarea
                    id="description"
                    className={`${inputCls} min-h-[120px] resize-none`}
                    placeholder={t.descriptionPh}
                    value={data.description}
                    onChange={update('description')}
                  />
                </div>
              </div>
            )}

            {/* Addım 2 — Yer və iş saatları */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="address" className={labelCls}>
                      {t.address} <span className="text-[#006653]">*</span>
                    </label>
                    <Input
                      id="address"
                      className={inputCls}
                      placeholder={t.addressPh}
                      value={data.address}
                      onChange={update('address')}
                    />
                  </div>
                  <div>
                    <label htmlFor="district" className={labelCls}>
                      {t.district} <span className="text-[#006653]">*</span>
                    </label>
                    <select
                      id="district"
                      className={selectCls}
                      value={data.district}
                      onChange={update('district')}>
                      <option value="" disabled>
                        {t.districtPh}
                      </option>
                      {BAKU_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="openFrom" className={labelCls}>
                      {t.openFrom} <span className="text-[#006653]">*</span>
                    </label>
                    <Input
                      id="openFrom"
                      type="time"
                      className={inputCls}
                      value={data.openFrom}
                      onChange={update('openFrom')}
                    />
                  </div>
                  <div>
                    <label htmlFor="openTo" className={labelCls}>
                      {t.openTo} <span className="text-[#006653]">*</span>
                    </label>
                    <Input
                      id="openTo"
                      type="time"
                      className={inputCls}
                      value={data.openTo}
                      onChange={update('openTo')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="mapLink" className={labelCls}>
                    {t.mapLink} <span className="text-[#006653]">*</span>
                  </label>
                  <Input
                    id="mapLink"
                    type="url"
                    className={inputCls}
                    placeholder={t.mapLinkPh}
                    value={data.mapLink}
                    onChange={update('mapLink')}
                  />
                </div>
              </div>
            )}

            {/* Addım 3 — Şəkillər */}
            {step === 2 && (
              <div className="space-y-6">
                <PhotoUpload
                  title={t.restaurantPhotosTitle}
                  required
                  hint={t.photosHint}
                  button={t.photosButton}
                  items={restaurantPhotos}
                  onAdd={(files) => addPhotos(setRestaurantPhotos, files)}
                  onRemove={(i) => removePhoto(setRestaurantPhotos, i)}
                />
                <PhotoUpload
                  title={t.menuPhotosTitle}
                  required
                  hint={t.photosHint}
                  button={t.photosButton}
                  items={menuPhotos}
                  onAdd={(files) => addPhotos(setMenuPhotos, files)}
                  onRemove={(i) => removePhoto(setMenuPhotos, i)}
                />
              </div>
            )}

            {/* Addım 4 — Əlaqə */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="ownerName" className={labelCls}>
                      {t.ownerName} <span className="text-[#006653]">*</span>
                    </label>
                    <Input
                      id="ownerName"
                      className={inputCls}
                      placeholder={t.ownerNamePh}
                      value={data.ownerName}
                      onChange={update('ownerName')}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelCls}>
                      {t.phone} <span className="text-[#006653]">*</span>
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      className={inputCls}
                      placeholder={t.phonePh}
                      value={data.phone}
                      onChange={update('phone')}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="email" className={labelCls}>
                      {t.email} <span className="text-[#006653]">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      className={inputCls}
                      placeholder={t.emailPh}
                      value={data.email}
                      onChange={update('email')}
                    />
                  </div>
                  <div>
                    <label htmlFor="website" className={labelCls}>
                      {t.website}{' '}
                      <span className="text-xs font-normal text-gray-400">
                        ({t.optional})
                      </span>
                    </label>
                    <Input
                      id="website"
                      className={inputCls}
                      placeholder={t.websitePh}
                      value={data.website}
                      onChange={update('website')}
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <AlertCircle className="h-5 w-5 shrink-0" />
                {error}
              </div>
            )}

            {/* Naviqasiya */}
            <div className="mt-8 flex items-center justify-between gap-4">
              <Button
                type="button"
                onClick={goBack}
                disabled={step === 0}
                variant="outline"
                className="rounded-xl border-gray-200 px-6 py-5 font-semibold text-gray-700 disabled:opacity-40">
                <ArrowLeft className="h-4 w-4" />
                {t.back}
              </Button>

              {step < TOTAL_STEPS - 1 ? (
                <Button
                  type="button"
                  onClick={goNext}
                  className="rounded-xl bg-[#006653] px-6 py-5 font-semibold text-white hover:bg-[#00543f]">
                  {t.next}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#006653] px-6 py-5 font-semibold text-white hover:bg-[#00543f] disabled:opacity-60">
                  {isSubmitting ? t.submitting : t.submit}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Stepper({
  steps,
  current,
  onSelect,
  t,
}: {
  steps: { title: string; icon: React.ComponentType<{ className?: string }> }[];
  current: number;
  onSelect: (i: number) => void;
  t: RestaurantRegisterDict;
}) {
  return (
    <div>
      {/* Mobil: cari addım mətni */}
      <p className="mb-3 text-center text-sm font-medium text-[#006653] sm:hidden">
        {t.step} {current + 1}/{steps.length} — {steps[current].title}
      </p>

      <div className="flex items-center">
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          const Icon = s.icon;
          return (
            <div key={s.title} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                onClick={() => onSelect(i)}
                disabled={i > current}
                className={`flex shrink-0 flex-col items-center gap-2 ${
                  i <= current ? 'cursor-pointer' : 'cursor-default'
                }`}>
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                    done
                      ? 'border-[#006653] bg-[#006653] text-white'
                      : active
                        ? 'border-[#006653] bg-[#9fe870] text-[#14532d]'
                        : 'border-gray-200 bg-white text-gray-400'
                  }`}>
                  {done ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </span>
                <span
                  className={`hidden max-w-[120px] text-center text-xs font-medium sm:block ${
                    active || done ? 'text-[#006653]' : 'text-gray-400'
                  }`}>
                  {s.title}
                </span>
              </button>

              {i < steps.length - 1 && (
                <span
                  className={`mx-2 h-0.5 flex-1 rounded-full transition-colors ${
                    i < current ? 'bg-[#006653]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PhotoUpload({
  title,
  hint,
  button,
  items,
  onAdd,
  onRemove,
  required,
  optionalLabel,
}: {
  title: string;
  hint: string;
  button: string;
  items: string[];
  onAdd: (files: FileList | null) => void;
  onRemove: (i: number) => void;
  required?: boolean;
  optionalLabel?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label className={labelCls}>
        {title}{' '}
        {required ? (
          <span className="text-[#006653]">*</span>
        ) : optionalLabel ? (
          <span className="text-xs font-normal text-gray-400">
            ({optionalLabel})
          </span>
        ) : null}
      </label>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onAdd(e.dataTransfer.files);
        }}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/60 px-6 py-8 text-center transition-colors hover:border-[#006653] hover:bg-[#006653]/5">
        <UploadCloud className="h-7 w-7 text-[#006653]" />
        <p className="text-xs text-gray-400">{hint}</p>
        <span className="mt-1 rounded-lg bg-[#9fe870] px-4 py-2 text-sm font-semibold text-[#14532d]">
          {button}
        </span>
        <input
          ref={ref}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onAdd(e.target.files)}
        />
      </button>

      {items.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {items.map((p, i) => (
            <li
              key={`${p}-${i}`}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600">
              <span className="max-w-[160px] truncate">{p}</span>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="text-gray-400 transition-colors hover:text-red-500">
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
