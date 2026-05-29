"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2, MessageSquare } from "lucide-react";
import ReviewCard from "@/components/Dashboard/ReviewCard";
import userService, { UserFeedbackItem } from "@/services/user.service";

const DICT: Record<
  string,
  { title: string; loadErr: string; empty: string; you: string }
> = {
  az: {
    title: "Rəylərim",
    loadErr: "Rəylər yüklənə bilmədi. Yenidən cəhd edin.",
    empty: "Hələ heç bir rəy yazmamısınız.",
    you: "Siz",
  },
  en: {
    title: "My Reviews",
    loadErr: "Could not load your reviews. Please try again.",
    empty: "You haven't written any reviews yet.",
    you: "You",
  },
  ru: {
    title: "Мои отзывы",
    loadErr: "Не удалось загрузить отзывы. Попробуйте снова.",
    empty: "Вы ещё не оставили ни одного отзыва.",
    you: "Вы",
  },
};

const FALLBACK_AVATAR = (name: string, surname: string) =>
  `https://ui-avatars.com/api/?background=006653&color=fff&name=${encodeURIComponent(
    `${name || ""} ${surname || ""}`.trim() || "Reviewer",
  )}`;

const extractImages = (item: UserFeedbackItem): string[] => {
  if (Array.isArray(item.galleries)) return item.galleries;
  if (Array.isArray(item.images)) return item.images;
  return [];
};

export default function ReviewsPage() {
  const { lang } = useParams<{ lang: string }>();
  const t = DICT[lang] ?? DICT.az;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", "feedbacks"],
    queryFn: () => userService.getFeedbacks(),
  });

  const feedbacks = data?.data ?? data?.feedbacks ?? [];

  return (
    <div>
      <h1 className="text-[28px] font-bold text-[#006653] mb-6">{t.title}</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[#006653]" />
        </div>
      ) : isError ? (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {t.loadErr}
        </p>
      ) : feedbacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eefae1] mb-3">
            <MessageSquare className="h-7 w-7 text-[#006653]" />
          </span>
          <p className="text-sm">{t.empty}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feedbacks.map((review) => (
            <ReviewCard
              key={review.id}
              id={String(review.id)}
              userName={`${review.name} ${review.surname}`.trim() || t.you}
              userAvatar={
                review.profile && review.profile.includes("/storage/")
                  ? review.profile
                  : FALLBACK_AVATAR(review.name, review.surname)
              }
              rating={Number(review.rate) || 0}
              reviewText={review.comment ?? ""}
              images={extractImages(review)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
