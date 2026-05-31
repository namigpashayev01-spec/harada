"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Loader2, Camera } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import userService from "@/services/user.service";

const FALLBACK_AVATAR =
  "https://ui-avatars.com/api/?background=006653&color=fff&name=";

interface Dict {
  name: string;
  namePh: string;
  email: string;
  emailPh: string;
  changePhoto: string;
  removePhoto: string;
  removing: string;
  cancel: string;
  save: string;
  saving: string;
  removedMsg: string;
  removeErr: string;
  updatedMsg: string;
  updateErr: string;
}

const DICT: Record<string, Dict> = {
  az: {
    name: "Ad",
    namePh: "Adınız",
    email: "E-poçt",
    emailPh: "E-poçt ünvanınız",
    changePhoto: "Şəkli dəyiş",
    removePhoto: "Sil",
    removing: "Silinir…",
    cancel: "Ləğv et",
    save: "Yadda saxla",
    saving: "Saxlanılır…",
    removedMsg: "Profil şəkli silindi.",
    removeErr: "Şəkil silinə bilmədi.",
    updatedMsg: "Profil yeniləndi.",
    updateErr: "Profil yenilənə bilmədi.",
  },
  en: {
    name: "Name",
    namePh: "Your name",
    email: "Email",
    emailPh: "Your email address",
    changePhoto: "Change photo",
    removePhoto: "Remove",
    removing: "Removing…",
    cancel: "Cancel",
    save: "Save",
    saving: "Saving…",
    removedMsg: "Profile picture removed.",
    removeErr: "Could not remove your picture.",
    updatedMsg: "Profile updated.",
    updateErr: "Could not update your profile.",
  },
  ru: {
    name: "Имя",
    namePh: "Ваше имя",
    email: "Эл. почта",
    emailPh: "Ваш адрес эл. почты",
    changePhoto: "Изменить фото",
    removePhoto: "Удалить",
    removing: "Удаление…",
    cancel: "Отмена",
    save: "Сохранить",
    saving: "Сохранение…",
    removedMsg: "Фото профиля удалено.",
    removeErr: "Не удалось удалить фото.",
    updatedMsg: "Профиль обновлён.",
    updateErr: "Не удалось обновить профиль.",
  },
};

export default function SettingsForm() {
  const { user, refreshUser, isInitializing } = useAuth();
  const { lang } = useParams<{ lang: string }>();
  const t = DICT[lang] ?? DICT.az;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      setImagePreview(user.image ?? null);
      setImageFile(null);
    }
  }, [user]);

  const handleSelectFile = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setImagePreview(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = async () => {
    if (!user?.image && !imageFile) return;
    setDeletingImage(true);
    setFeedback(null);
    try {
      await userService.deleteImage();
      setImageFile(null);
      setImagePreview(null);
      await refreshUser();
      setFeedback({ type: "success", text: t.removedMsg });
    } catch {
      setFeedback({ type: "error", text: t.removeErr });
    } finally {
      setDeletingImage(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      await userService.changeProfile({
        name,
        email,
        image: imageFile ?? undefined,
      });
      setImageFile(null);
      await refreshUser();
      setFeedback({ type: "success", text: t.updatedMsg });
    } catch {
      setFeedback({ type: "error", text: t.updateErr });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      setImagePreview(user.image ?? null);
      setImageFile(null);
    }
    setFeedback(null);
  };

  if (isInitializing) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#006653]" />
      </div>
    );
  }

  const canRemove = !!user?.image || !!imageFile;
  const inputClass =
    "w-full h-12 border-gray-200 focus-visible:ring-[#006653]/30 focus-visible:border-[#006653]";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 w-full max-w-2xl">
      {/* Avatar header */}
      <div className="flex items-center gap-5 pb-6 border-b border-gray-100">
        <div className="relative shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 ring-4 ring-[#eefae1]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                imagePreview ||
                `${FALLBACK_AVATAR}${encodeURIComponent(name || email || "User")}`
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleSelectFile}
            aria-label={t.changePhoto}
            className="absolute -bottom-1 -right-1 h-9 w-9 rounded-full bg-[#006653] hover:bg-[#00543f] text-white flex items-center justify-center shadow-md transition-colors">
            <Camera className="h-4 w-4" />
          </button>
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate text-lg">
            {name || t.namePh}
          </p>
          {email && (
            <p className="text-sm text-gray-500 truncate">{email}</p>
          )}
          <div className="flex items-center gap-4 mt-2">
            <button
              type="button"
              onClick={handleSelectFile}
              className="text-sm font-medium text-[#006653] hover:underline">
              {t.changePhoto}
            </button>
            {canRemove && (
              <button
                type="button"
                onClick={handleDeleteImage}
                disabled={deletingImage}
                className="text-sm font-medium text-red-500 hover:underline disabled:opacity-50">
                {deletingImage ? t.removing : t.removePhoto}
              </button>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Fields */}
      <div className="space-y-5 pt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.name}
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.namePh}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.email}
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPh}
            className={inputClass}
          />
        </div>
      </div>

      {feedback && (
        <p
          className={`mt-6 text-sm rounded-lg px-3 py-2 ${
            feedback.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
          {feedback.text}
        </p>
      )}

      {/* Footer */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="h-11 px-6 rounded-xl border-gray-300 text-[#475569] w-full sm:w-auto">
          <X className="w-4 h-4 mr-2" />
          {t.cancel}
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="h-11 px-6 rounded-xl bg-[#9fe870] hover:bg-[#8fdc5c] text-[#14532d] font-semibold w-full sm:w-auto">
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Check className="w-4 h-4 mr-2" />
          )}
          {saving ? t.saving : t.save}
        </Button>
      </div>
    </div>
  );
}
