"use client";
import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import RestaurantCard from "@/components/Dashboard/RestaurantCard";
import userService, { FavoriteRestaurant } from "@/services/user.service";

const DICT: Record<
  string,
  {
    title: string;
    searchPh: string;
    loadErr: string;
    emptyNone: string;
    emptySearch: string;
    remove: string;
    viewMenu: string;
  }
> = {
  az: {
    title: "Saxlanmış restoranlar",
    searchPh: "Restoran və mətbəx axtar...",
    loadErr: "Sevimlilər yüklənə bilmədi. Yenidən cəhd edin.",
    emptyNone: "Hələ heç bir restoran saxlamamısınız.",
    emptySearch: "Axtarışınıza uyğun sevimli tapılmadı.",
    remove: "Sil",
    viewMenu: "Menyuya bax",
  },
  en: {
    title: "Saved Restaurants",
    searchPh: "Search restaurant and cuisines...",
    loadErr: "Could not load your favorites. Please try again.",
    emptyNone: "You haven't saved any restaurants yet.",
    emptySearch: "No favorites match your search.",
    remove: "Remove",
    viewMenu: "View menu",
  },
  ru: {
    title: "Сохранённые рестораны",
    searchPh: "Поиск ресторанов и кухонь...",
    loadErr: "Не удалось загрузить избранное. Попробуйте снова.",
    emptyNone: "Вы ещё не сохранили ни одного ресторана.",
    emptySearch: "Ничего не найдено по вашему запросу.",
    remove: "Удалить",
    viewMenu: "Открыть меню",
  },
};

const resolveSlug = (fav: FavoriteRestaurant, lang: string): string => {
  const s = fav.slug;
  if (!s) return String(fav.id);
  return (
    (s[lang as keyof typeof s] as string | undefined) ||
    s.az ||
    s.en ||
    s.ru ||
    String(fav.id)
  );
};

export default function FavoritesPage() {
  const queryClient = useQueryClient();
  const { lang } = useParams<{ lang: string }>();
  const t = DICT[lang] ?? DICT.az;
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", "favorites"],
    queryFn: () => userService.getFavorites(),
  });

  const favorites = useMemo(
    () => data?.data ?? data?.favorites ?? [],
    [data],
  );

  const removeMutation = useMutation({
    mutationFn: (id: number) => userService.removeFavorite(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["user", "favorites"] });
      const prev = queryClient.getQueryData<typeof data>([
        "user",
        "favorites",
      ]);
      if (prev) {
        const next = {
          ...prev,
          data: (prev.data ?? prev.favorites ?? []).filter(
            (r: FavoriteRestaurant) => r.id !== id,
          ),
        };
        queryClient.setQueryData(["user", "favorites"], next);
      }
      return { prev };
    },
    onError: (_err, _id, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["user", "favorites"], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "favorites"] });
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return favorites;
    return favorites.filter((r) => {
      const inTitle = r.title?.toLowerCase().includes(q);
      const inCategory = r.categories?.some((c) =>
        c.title?.toLowerCase().includes(q),
      );
      return inTitle || inCategory;
    });
  }, [favorites, search]);

  return (
    <div>
      <DashboardHeader
        title={t.title}
        searchPlaceholder={t.searchPh}
        onSearch={setSearch}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[#006653]" />
        </div>
      ) : isError ? (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {t.loadErr}
        </p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eefae1] mb-3">
            <Heart className="h-7 w-7 text-[#006653]" />
          </span>
          <p className="text-sm">
            {favorites.length === 0 ? t.emptyNone : t.emptySearch}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              id={String(restaurant.id)}
              name={restaurant.title}
              cuisine={restaurant.categories?.[0]?.title ?? ""}
              location={restaurant.address ?? ""}
              image={restaurant.image}
              href={`/${lang || "en"}/places/${resolveSlug(restaurant, lang || "en")}`}
              onRemove={() => removeMutation.mutate(restaurant.id)}
              removeLabel={t.remove}
              menuLabel={t.viewMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
}
