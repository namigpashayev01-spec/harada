"use client";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, MapPin, Calendar, Loader2, BookOpen, X, Clock, Users } from "lucide-react";
import reservationService, { UserReservation } from "@/services/reservation.service";

const STATUS_STYLES: Record<string, string> = {
  success: "text-green-700 bg-green-50",
  warning: "text-yellow-700 bg-yellow-50",
  danger: "text-red-700 bg-red-50",
  info: "text-blue-700 bg-blue-50",
};

const STATUS_LABELS: Record<string, string> = {
  ORDERED: "Pending confirmation",
  CONFIRMED: "Confirmed",
  DECLINED_BY_USER: "Cancelled by you",
  DECLINED_BY_RESTORAN: "Declined by restaurant",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

function isCancelled(r: UserReservation) {
  return r.status_color === "danger" || r.status?.toUpperCase() === "CANCELLED";
}

function ReservationRow({
  reservation,
  onCancel,
  cancelling,
}: {
  reservation: UserReservation;
  onCancel: (id: number) => void;
  cancelling: boolean;
}) {
  const colorKey = reservation.status_color ?? "info";
  const badgeClass = STATUS_STYLES[colorKey] ?? STATUS_STYLES.info;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 items-start">
      {reservation.restoran_image && (
        <img
          src={reservation.restoran_image}
          alt={reservation.title ?? ""}
          className="w-20 h-20 rounded-lg object-cover shrink-0"
        />
      )}

      <div className="flex-1 min-w-0">
        {/* Title + status badge */}
        <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <Building2 className="w-4 h-4 text-[#004225] shrink-0" />
            <span className="font-semibold text-gray-900 truncate">
              {reservation.title ?? `Reservation #${reservation.id}`}
            </span>
          </div>
          {reservation.status && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass}`}>
              {STATUS_LABELS[reservation.status] ?? reservation.status}
            </span>
          )}
        </div>

        {/* Address */}
        {reservation.restoran_address && (
          <div className="flex items-start gap-1.5 text-gray-500 mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span className="text-sm line-clamp-1">{reservation.restoran_address}</span>
          </div>
        )}

        {/* Date / time / guests */}
        <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-3">
          {reservation.date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span className="text-sm">{reservation.date}</span>
            </div>
          )}
          {reservation.time && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="text-sm">{reservation.time_slot ? `${reservation.time_slot} · ` : ""}{reservation.time}</span>
            </div>
          )}
          {reservation.guest_count != null && (
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span className="text-sm">
                {reservation.guest_count} guest{Number(reservation.guest_count) > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Booking ID */}
        {reservation.booking_id && (
          <p className="text-xs text-gray-400 mb-3">Booking ID: {reservation.booking_id}</p>
        )}

        {/* Cancel button — only when not already cancelled */}
        {!isCancelled(reservation) && (
          <button
            onClick={() => onCancel(reservation.id)}
            disabled={cancelling}
            className="flex items-center gap-1.5 text-sm text-red-600 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50">
            {cancelling ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <X className="w-3.5 h-3.5" />
            )}
            Cancel Reservation
          </button>
        )}
      </div>
    </div>
  );
}

export default function ReservationsPage() {
  const queryClient = useQueryClient();
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", "reservations"],
    queryFn: () => reservationService.getMyReservations(),
  });

  const reservations: UserReservation[] = data?.data ?? data?.reservations ?? [];
  const active = reservations.filter((r) => !isCancelled(r));
  const past = reservations.filter((r) => isCancelled(r));

  const handleCancel = async (id: number) => {
    setCancellingId(id);
    setCancelError(null);
    try {
      await reservationService.cancel(id);
      queryClient.invalidateQueries({ queryKey: ["user", "reservations"] });
    } catch {
      setCancelError("Could not cancel the reservation. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[#F57D0D]" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
        Could not load your reservations. Please try again.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-[28px] text-[#004225]">My Reservations</h1>

      {cancelError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {cancelError}
        </p>
      )}

      {reservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <BookOpen className="h-10 w-10 mb-2 text-gray-300" />
          <p className="text-sm">You have no reservations yet.</p>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-gray-700 mb-3">Current Bookings</h2>
              <div className="space-y-3">
                {active.map((r) => (
                  <ReservationRow
                    key={r.id}
                    reservation={r}
                    onCancel={handleCancel}
                    cancelling={cancellingId === r.id}
                  />
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-gray-700 mb-3">Cancelled</h2>
              <div className="space-y-3">
                {past.map((r) => (
                  <ReservationRow
                    key={r.id}
                    reservation={r}
                    onCancel={handleCancel}
                    cancelling={cancellingId === r.id}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
