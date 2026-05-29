"use client";
import React from "react";
import Link from "next/link";
import { MapPin, FileText, ChefHat } from "lucide-react";

interface RestaurantCardProps {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  image: string;
  href?: string;
  onRemove?: (id: string) => void;
}

export default function RestaurantCard({
  id,
  name,
  cuisine,
  location,
  image,
  href,
  onRemove,
}: RestaurantCardProps) {
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
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex gap-4">
        <Wrapper className="shrink-0">
          <img
            src={image}
            alt={name}
            className="w-24 h-24 rounded-lg object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200";
            }}
          />
        </Wrapper>

        <div className="flex flex-col min-w-0 justify-between items-end w-full">
          <div className="flex items-start justify-between mb-3 w-full">
            <Wrapper className="line-clamp-1">
              <h3 className="text-lg font-semibold text-[#004225] line-clamp-1">
                {name}
              </h3>
            </Wrapper>
            <button
              onClick={handleRemove}
              className="text-[#BA1717] text-sm font-medium transition-colors shrink-0 ml-2"
            >
              Remove
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 w-full">
            {location && (
              <div className="flex items-center gap-2 text-[#004225] min-w-0">
                <MapPin className="w-4 h-4 text-gray-800 shrink-0" />
                <span className="text-sm line-clamp-1">{location}</span>
              </div>
            )}

            <div className="flex items-center gap-4 flex-wrap">
              {href && (
                <Link
                  href={href}
                  className="flex items-center gap-2 text-[#004225]"
                >
                  <FileText className="w-4 h-4 text-gray-800 shrink-0" />
                  <span className="text-sm">View menu</span>
                </Link>
              )}

              {cuisine && (
                <div className="flex items-center gap-2 text-[#004225]">
                  <ChefHat className="w-4 h-4 text-gray-800 shrink-0" />
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
