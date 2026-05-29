"use client";
import React from "react";
import { Building2, MapPin, Calendar } from "lucide-react";

interface ReservationCardProps {
  id: string;
  hotelName: string;
  location: string;
  date: string;
  time: string;
  guests: number;
  image: string;
  status: "confirmed" | "pending" | "cancelled";
  reservationId: string;
  onCheckDetails?: (id: string) => void;
}

export default function ReservationCard({
  id,
  hotelName,
  location,
  date,
  time,
  guests,
  image,
  status,
  reservationId,
  onCheckDetails,
}: ReservationCardProps) {
  const handleCheckDetails = () => {
    if (onCheckDetails) {
      onCheckDetails(id);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "confirmed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex gap-4">
        {/* Image Section */}
        <div className="shrink-0">
          <img
            src={image}
            alt={hotelName}
            className="w-[92px] h-[92px] rounded-lg object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300";
            }}
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          {/* Hotel Name with Status */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <Building2 className="w-5 h-5 text-[#004225] shrink-0" />
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {hotelName}
              </h3>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`text-sm font-semibold uppercase ${getStatusColor()}`}
              >
                {status}
              </span>
              <span className="text-sm text-gray-600">ID {reservationId}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 text-gray-600 mb-2">
            <MapPin className="w-4 h-4 text-[#004225] shrink-0 mt-0.5" />
            <span className="text-sm line-clamp-2">{location}</span>
          </div>

          {/* Date/Time/Guests with Check Details Button */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-600 min-w-0">
              <Calendar className="w-4 h-4 text-[#004225] shrink-0" />
              <span className="text-sm line-clamp-1">
                {date} at {time} for {guests} Guest{guests > 1 ? "s" : ""}
              </span>
            </div>
            <button
              onClick={handleCheckDetails}
              className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors shrink-0"
            >
              Check Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
