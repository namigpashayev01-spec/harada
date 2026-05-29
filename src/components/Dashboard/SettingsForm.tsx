"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import userService from "@/services/user.service";

const FALLBACK_AVATAR =
  "https://ui-avatars.com/api/?background=F57D0D&color=fff&name=";

export default function SettingsForm() {
  const { user, refreshUser, isInitializing } = useAuth();
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
      setFeedback({ type: "success", text: "Profile picture removed." });
    } catch {
      setFeedback({ type: "error", text: "Could not remove your picture." });
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
      setFeedback({ type: "success", text: "Profile updated." });
    } catch {
      setFeedback({ type: "error", text: "Could not update your profile." });
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#006653]" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 w-full">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
          <label className="sm:w-40 text-base font-medium text-gray-900">Name</label>
          <div className="flex-1 sm:max-w-[520px] w-full">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full h-12 border-gray-300"
            />
          </div>
        </div>
        <div className="border-t border-[#E2E8F0] w-full"></div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
          <label className="sm:w-40 text-base font-medium text-gray-900">Email</label>
          <div className="flex-1 sm:max-w-[520px] w-full">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-12 border-gray-300"
            />
          </div>
        </div>
        <div className="border-t border-[#E2E8F0] w-full"></div>

        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-8">
          <label className="sm:w-40 text-base font-medium text-gray-900 sm:pt-2">
            Profile Picture
          </label>
          <div className="flex-1 flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 shrink-0">
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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleSelectFile}
              className="border-[#006653] text-[#00543f] hover:text-[#00543f] h-10"
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleDeleteImage}
              disabled={deletingImage || (!user?.image && !imageFile)}
              className="border-[#FF0000] text-[#FF0000] hover:text-[#FF0000] h-10"
            >
              {deletingImage ? "Removing…" : "Delete"}
            </Button>
          </div>
        </div>

        {feedback && (
          <p
            className={`text-sm rounded-lg px-3 py-2 ${
              feedback.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {feedback.text}
          </p>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="h-10 px-6 rounded-[12px] border-[#CBD5E1] text-[#475569] w-full sm:w-auto"
          >
            Cancel
            <X className="w-4 h-4 mr-2" />
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="h-10 px-6 rounded-[12px] bg-[#006653] hover:bg-[#00543f] text-white w-full sm:w-auto"
          >
            {saving ? "Saving…" : "Save"}
            <Check className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
