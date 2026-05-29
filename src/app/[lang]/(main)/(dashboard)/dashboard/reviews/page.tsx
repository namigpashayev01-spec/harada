"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, MessageSquare } from "lucide-react";
import ReviewCard from "@/components/Dashboard/ReviewCard";
import userService, { UserFeedbackItem } from "@/services/user.service";

const FALLBACK_AVATAR = (name: string, surname: string) =>
  `https://ui-avatars.com/api/?background=F57D0D&color=fff&name=${encodeURIComponent(
    `${name || ""} ${surname || ""}`.trim() || "Reviewer",
  )}`;

const extractImages = (item: UserFeedbackItem): string[] => {
  if (Array.isArray(item.galleries)) return item.galleries;
  if (Array.isArray(item.images)) return item.images;
  return [];
};

export default function ReviewsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", "feedbacks"],
    queryFn: () => userService.getFeedbacks(),
  });

  const feedbacks = data?.data ?? data?.feedbacks ?? [];

  return (
    <div>
      <h1 className="text-[28px] text-[#004225] mb-6">Reviews</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[#006653]" />
        </div>
      ) : isError ? (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          Could not load your reviews. Please try again.
        </p>
      ) : feedbacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <MessageSquare className="h-10 w-10 mb-2 text-gray-300" />
          <p className="text-sm">You haven&apos;t written any reviews yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feedbacks.map((review) => (
            <ReviewCard
              key={review.id}
              id={String(review.id)}
              userName={`${review.name} ${review.surname}`.trim() || "You"}
              userAvatar={
                review.profile && review.profile.includes('/storage/')
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
