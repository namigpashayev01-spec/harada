"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  MapPin,
  Calendar,
  Loader2,
  BookOpen,
  X,
  Clock,
  Users,
} from "lucide-react";
import reservationService, {
  UserReservation,
} from "@/services/reservation.service";

const STATUS_STYLES: Record<string, string> = {
  success: "text-green-700 bg-green-50",
  warning: "text-yellow-700 bg-yellow-50",
  danger: "text-red-700 bg-red-50",
  info: "text-blue-700 bg-blue-50",
};

interface Dict {
  title: string;
  current: string;
  cancelledSection: string;
  empty: string;
  loadErr: string;
  cancelErr: string;
  cancelBtn: string;
  cancelling: string;
  bookingId: string;
  guests: (n: number) => string;
  status: Record<string, string>;
}

const DICT: Record<string, Dict> = {
  az: {
    title: "Rezervasiyalarım",
    current: "Cari rezervasiyalar",
    cancelledSection: "Ləğv edilmiş",
    empty: "Hələ rezervasiyanız yoxdur.",
    loadErr: "Rezervasiyalar yüklənə bilmədi. Yenidən cəhd edin.",
    cancelErr: "Rezervasiya ləğv edilə bilmədi. Yenidən cəhd edin.",
    cancelBtn: "Rezervasiyanı ləğv et",
    cancelling: "Ləğv edilir…",
    bookingId: "Rezervasiya ID",
    guests: (n) => `${n} qonaq`,
    status: {
      ORDERED: "Təsdiq gözlənilir",
      CONFIRMED: "Təsdiqləndi",
      DECLINED_BY_USER: "Sizin tərəfdən ləğv edildi",
      DECLINED_BY_RESTORAN: "Restoran tərəfindən rədd edildi",
      CANCELLED: "Ləğv edildi",
      COMPLETED: "Tamamlandı",
    },
  },
  en: {
    title: "My Reservations",
    current: "Current Bookings",
    cancelledSection: "Cancelled",
    empty: "You have no reservations yet.",
    loadErr: "Could not load your reservations. Please try again.",
    cancelErr: "Could not cancel the reservation. Please try again.",
    cancelBtn: "Cancel Reservation",
    cancelling: "Cancelling…",
    bookingId: "Booking ID",
    guests: (n) => `${n} guest${n > 1 ? "s" : ""}`,
    status: {
      ORDERED: "Pending confirmation",
      CONFIRMED: "Confirmed",
      DECLINED_BY_USER: "Cancelled by you",
      DECLINED_BY_RESTORAN: "Declined by restaurant",
      CANCELLED: "Cancelled",
      COMPLETED: "Completed",
    },
  },
  ru: {
    title: "Мои бронирования",
    current: "Текущие бронирования",
    cancelledSection: "Отменённые",
    empty: "У вас пока нет бронирований.",
    loadErr: "Не удалось загрузить бронирования. Попробуйте снова.",
    cancelErr: "Не удалось отменить бронирование. Попробуйте снова.",
    cancelBtn: "Отменить бронирование",
    cancelling: "Отмена…",
    bookingId: "ID бронирования",
    guests: (n) => `${n} гостей`,
    status: {
      ORDERED: "Ожидает подтверждения",
      CONFIRMED: "Подтверждено",
      DECLINED_BY_USER: "Отменено вами",
      DECLINED_BY_RESTORAN: "Отклонено рестораном",
      CANCELLED: "Отменено",
      COMPLETED: "Завершено",
    },
  },
};

function isCancelled(r: UserReservation) {
  return r.status_color === "danger" || r.status?.toUpperCase() === "CANCELLED";
}

function ReservationRow({
  reservation,
  onCancel,
  cancelling,
  t,
}: {
  reservation: UserReservation;
  onCancel: (id: number) => void;
  cancelling: boolean;
  t: Dict;
}) {
  const colorKey = reservation.status_color ?? "info";
  const badgeClass = STATUS_STYLES[colorKey] ?? STATUS_STYLES.info;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex gap-4 items-start hover:shadow-md transition-shadow">
      {reservation.restoran_image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={reservation.restoran_image}
          alt={reservation.title ?? ""}
          className="w-20 h-20 rounded-xl object-cover shrink-0"
        />
      ) : (
        <div className="w-20 h-20 rounded-xl shrink-0 bg-gradient-to-br from-[#013a30] to-[#0a7d54] flex items-center justify-center">
          <Building2 className="w-7 h-7 text-white/80" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        {/* Title + status badge */}
        <div className="flex items-start justify-between gap-2 flex-wrap mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <Building2 className="w-4 h-4 text-[#006653] shrink-0" />
            <span className="font-semibold text-gray-900 truncate">
              {reservation.title ?? `Reservation #${reservation.id}`}
            </span>
          </div>
          {reservation.status && (
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${badgeClass}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {t.status[reservation.status] ?? reservation.status}
            </span>
          )}
        </div>

        {/* Address */}
        {reservation.restoran_address && (
          <div className="flex items-start gap-1.5 text-gray-500 mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span className="text-sm line-clamp-1">
              {reservation.restoran_address}
            </span>
          </div>
        )}

        {/* Date / time / guests */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-gray-600 mb-3">
          {reservation.date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 shrink-0 text-[#006653]" />
              <span className="text-sm">{reservation.date}</span>
            </div>
          )}
          {reservation.time && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 shrink-0 text-[#006653]" />
              <span className="text-sm">
                {reservation.time_slot ? `${reservation.time_slot} · ` : ""}
                {reservation.time}
              </span>
            </div>
          )}
          {reservation.guest_count != null && (
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 shrink-0 text-[#006653]" />
              <span className="text-sm">
                {t.guests(Number(reservation.guest_count))}
              </span>
            </div>
          )}
        </div>

        {/* Booking ID */}
        {reservation.booking_id && (
          <p className="text-xs text-gray-400 mb-3">
            {t.bookingId}: {reservation.booking_id}
          </p>
        )}

        {/* Cancel button — only when not already cancelled */}
        {!isCancelled(reservation) && (
          <button
            onClick={() => onCancel(reservation.id)}
            disabled={cancelling}
            className="flex items-center gap-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50">
            {cancelling ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <X className="w-3.5 h-3.5" />
            )}
            {cancelling ? t.cancelling : t.cancelBtn}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ReservationsPage() {
  const { lang } = useParams<{ lang: string }>();
  const t = DICT[lang] ?? DICT.az;
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
      setCancelError(t.cancelErr);
    } finally {
      setCancellingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[#006653]" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
        {t.loadErr}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-[28px] font-bold text-[#006653]">{t.title}</h1>

      {cancelError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {cancelError}
        </p>
      )}

      {reservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eefae1] mb-3">
            <BookOpen className="h-7 w-7 text-[#006653]" />
          </span>
          <p className="text-sm">{t.empty}</p>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-gray-700 mb-3">
                {t.current} ({active.length})
              </h2>
              <div className="space-y-3">
                {active.map((r) => (
                  <ReservationRow
                    key={r.id}
                    reservation={r}
                    onCancel={handleCancel}
                    cancelling={cancellingId === r.id}
                    t={t}
                  />
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-gray-700 mb-3">
                {t.cancelledSection} ({past.length})
              </h2>
              <div className="space-y-3">
                {past.map((r) => (
                  <ReservationRow
                    key={r.id}
                    reservation={r}
                    onCancel={handleCancel}
                    cancelling={cancellingId === r.id}
                    t={t}
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
