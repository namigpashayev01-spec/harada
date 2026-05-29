"use client";
import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import RestaurantCard from "@/components/Dashboard/RestaurantCard";
import userService, { FavoriteRestaurant } from "@/services/user.service";

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
        title="Saved Restaurants"
        searchPlaceholder="Search restaurant and cuisines..."
        onSearch={setSearch}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-[#006653]" />
        </div>
      ) : isError ? (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          Could not load your favorites. Please try again.
        </p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <Heart className="h-10 w-10 mb-2 text-gray-300" />
          <p className="text-sm">
            {favorites.length === 0
              ? "You haven't saved any restaurants yet."
              : "No favorites match your search."}
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
