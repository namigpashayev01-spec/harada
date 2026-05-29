"use client";
import React from "react";
import { Star, MoreVertical } from "lucide-react";

interface ReviewCardProps {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  reviewText: string;
  images: string[];
  onMenuClick?: (id: string) => void;
}

export default function ReviewCard({
  id,
  userName,
  userAvatar,
  rating,
  reviewText,
  images,
  onMenuClick,
}: ReviewCardProps) {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= rating ? "fill-[#FF9500] text-[#FF9500]" : "text-[#FF9500]"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      {/* Header with Avatar, Name, Rating, Menu */}
      <div className="flex items-start gap-3 mb-4">
        {/* Avatar */}
        <div className="shrink-0">
          <img
            src={userAvatar}
            alt={userName}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://ui-avatars.com/api/?name=" + userName;
            }}
          />
        </div>

        {/* Name and Rating */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            {userName}
          </h3>
          <div className="flex items-center gap-0.5">{renderStars()}</div>
        </div>

        {/* Menu Button */}
        <button
          onClick={() => onMenuClick?.(id)}
          className="shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Review Text */}
      <p className="text-xs text-[#5F5F5F] leading-relaxed mb-4">
        {reviewText}
      </p>

      {/* Images */}
      {images.length > 0 && (
        <div className="flex gap-2">
          {images.slice(0, 3).map((image, index) => (
            <div
              key={index}
              className="w-[70px] h-[70px] rounded-lg overflow-hidden shrink-0"
            >
              <img
                src={image}
                alt={`Review image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200";
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
