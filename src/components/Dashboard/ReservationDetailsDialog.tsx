"use client";
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  FileText,
  X as CloseIcon,
} from "lucide-react";

interface ReservationDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: {
    hotelName: string;
    location: string;
    date: string;
    time: string;
    guests: number;
    image: string;
    status: string;
    reservationId: string;
  } | null;
}

export default function ReservationDetailsDialog({
  open,
  onOpenChange,
  reservation,
}: ReservationDetailsDialogProps) {
  if (!reservation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden gap-0 min-w-[900px]">
        {/* Content */}
        <div className="p-8 py-[50px] space-y-6">
          {/* Success Icon and Title */}
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Green Check Circle */}
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="60"
                cy="60"
                r="60"
                fill="#23A26D"
                fill-opacity="0.12"
              />
              <path
                d="M60.8325 32.2222C45.5269 32.2222 33.0547 44.6945 33.0547 60C33.0547 75.3056 45.5269 87.7778 60.8325 87.7778C76.138 87.7778 88.6102 75.3056 88.6102 60C88.6102 44.6945 76.138 32.2222 60.8325 32.2222ZM74.1102 53.6111L58.3602 69.3611C57.9714 69.75 57.4436 69.9722 56.888 69.9722C56.3325 69.9722 55.8047 69.75 55.4158 69.3611L47.5547 61.5C46.7491 60.6945 46.7491 59.3611 47.5547 58.5556C48.3602 57.75 49.6936 57.75 50.4991 58.5556L56.888 64.9445L71.1658 50.6667C71.9714 49.8611 73.3047 49.8611 74.1102 50.6667C74.9158 51.4722 74.9158 52.7778 74.1102 53.6111Z"
                fill="#23A26D"
              />
            </svg>

            {/* Confirmation Text */}
            <div>
              <h2 className="text-[28px]  text-[#3F3F3F] mb-1">
                Booking Confirmed !!
              </h2>
              <p className="text-[#3F3F3F]  text-[22px]">
                Booking ID: {reservation.reservationId}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#C5C5C5]" />

          {/* Venue Details */}
          <div className="text-center space-y-2">
            <h3 className="text-[28px] text-[#3F3F3F]">
              {reservation.hotelName}
            </h3>
            <p className="text-base text-[#3F3F3F] leading-relaxed">
              {reservation.location}
            </p>
          </div>

          {/* Booking Details Cards */}
          <div className="grid grid-cols-3 gap-4">
            {/* Date Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center space-y-2">
              <Calendar className="w-6 h-6 text-gray-700" />
              <p className="text-sm text-gray-700 font-medium text-center">
                {reservation.date}
              </p>
            </div>

            {/* Time Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center space-y-2">
              <Clock className="w-6 h-6 text-gray-700" />
              <p className="text-sm text-gray-700 font-medium text-center">
                {reservation.time}
              </p>
            </div>

            {/* Guests Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center space-y-2">
              <Users className="w-6 h-6 text-gray-700" />
              <p className="text-sm text-gray-700 font-medium text-center">
                {reservation.guests} Guest{reservation.guests > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {/* Get Direction Button */}
            <button className="bg-[#006FD5] h-[54px] hover:bg-[#006fd5b9]  text-white rounded-lg py-3 px-4 flex  items-center justify-center gap-1 transition-colors">
              <MapPin className="w-5 h-5" />
              <span className="text-xs font-medium">Get Direction</span>
            </button>

            {/* View Menu Button */}
            <button className="bg-[#006FD5] h-[54px] hover:bg-[#006fd5b9] text-white rounded-lg py-3 px-4 flex items-center justify-center gap-1 transition-colors">
              <FileText className="w-5 h-5" />
              <span className="text-xs font-medium">View Menu</span>
            </button>

            {/* Cancel Booking Button */}
            <button className="bg-[#FF5757] h-[54px] hover:bg-[#ff5757b9] text-white rounded-lg py-3 px-4 flex  items-center justify-center gap-1 transition-colors">
              <CloseIcon className="w-5 h-5" />
              <span className="text-xs font-medium">Cancel Booking</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
