"use client";
import React, { useState } from "react";
import { Star, ImageOff } from "lucide-react";

interface ReviewCardProps {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  reviewText: string;
  images: string[];
}

function ReviewImage({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div className="w-[70px] h-[70px] rounded-xl shrink-0 bg-gray-100 flex items-center justify-center">
        <ImageOff className="w-5 h-5 text-gray-300" />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="w-[70px] h-[70px] rounded-xl object-cover shrink-0"
      onError={() => setError(true)}
    />
  );
}

export default function ReviewCard({
  userName,
  userAvatar,
  rating,
  reviewText,
  images,
}: ReviewCardProps) {
  const extra = images.length - 3;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      {/* Header: avatar, name, rating */}
      <div className="flex items-center gap-3 mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={userAvatar}
          alt={userName}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-[#eefae1] shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {userName}
          </h3>
          <div className="flex items-center gap-0.5 mt-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i <= rating
                    ? "fill-orange-400 text-orange-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Review text */}
      {reviewText && (
        <p className="text-sm text-gray-600 leading-relaxed mb-4 whitespace-pre-line [overflow-wrap:anywhere]">
          {reviewText}
        </p>
      )}

      {/* Images */}
      {images.length > 0 && (
        <div className="flex gap-2">
          {images.slice(0, 3).map((image, index) => (
            <div key={index} className="relative">
              <ReviewImage src={image} alt={`Review image ${index + 1}`} />
              {index === 2 && extra > 0 && (
                <div className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center text-white text-sm font-semibold">
                  +{extra}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
