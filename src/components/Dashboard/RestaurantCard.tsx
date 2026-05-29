"use client";
import React, { useState } from "react";
import Link from "next/link";
import { MapPin, FileText, ChefHat, Trash2, UtensilsCrossed } from "lucide-react";

interface RestaurantCardProps {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  image: string;
  href?: string;
  onRemove?: (id: string) => void;
  removeLabel?: string;
  menuLabel?: string;
}

export default function RestaurantCard({
  id,
  name,
  cuisine,
  location,
  image,
  href,
  onRemove,
  removeLabel = "Remove",
  menuLabel = "View menu",
}: RestaurantCardProps) {
  const [imgError, setImgError] = useState(false);
  const handleRemove = () => {
    if (onRemove) onRemove(id);
  };

  const Wrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className,
  }) =>
    href ? (
      <Link href={href} className={className}>
        {children}
      </Link>
    ) : (
      <span className={className}>{children}</span>
    );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex gap-4">
        <Wrapper className="shrink-0">
          {image && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={name}
              className="w-24 h-24 rounded-xl object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-[#013a30] to-[#0a7d54] flex items-center justify-center">
              <UtensilsCrossed className="w-8 h-8 text-white/80" />
            </div>
          )}
        </Wrapper>

        <div className="flex flex-col min-w-0 justify-between items-end w-full">
          <div className="flex items-start justify-between mb-3 w-full">
            <Wrapper className="line-clamp-1">
              <h3 className="text-lg font-semibold text-[#006653] line-clamp-1 hover:underline">
                {name}
              </h3>
            </Wrapper>
            <button
              onClick={handleRemove}
              className="flex items-center gap-1.5 text-[#BA1717] text-sm font-medium hover:text-red-700 transition-colors shrink-0 ml-2"
            >
              <Trash2 className="w-4 h-4" />
              {removeLabel}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 w-full">
            {location && (
              <div className="flex items-center gap-2 text-gray-600 min-w-0">
                <MapPin className="w-4 h-4 text-[#006653] shrink-0" />
                <span className="text-sm line-clamp-1">{location}</span>
              </div>
            )}

            <div className="flex items-center gap-4 flex-wrap">
              {href && (
                <Link
                  href={href}
                  className="flex items-center gap-2 text-[#006653] font-medium hover:underline"
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span className="text-sm">{menuLabel}</span>
                </Link>
              )}

              {cuisine && (
                <div className="flex items-center gap-2 text-gray-600">
                  <ChefHat className="w-4 h-4 text-[#006653] shrink-0" />
                  <span className="text-sm">{cuisine}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
