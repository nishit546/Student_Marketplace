"use client";

import * as React from "react";
import { Product } from "@/types";

interface FavoritesContextType {
  favoriteIds: string[];
  favoriteProducts: Product[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => Promise<boolean>;
  addFavorite: (productId: string) => Promise<boolean>;
  removeFavorite: (productId: string) => Promise<boolean>;
  favoritesCount: number;
  isLoading: boolean;
  refreshFavorites: () => Promise<void>;
}

const FAVORITES_STORAGE_KEY = "campuskart_favorite_ids";

const FavoritesContext = React.createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = React.useState<string[]>([]);
  const [favoriteProducts, setFavoriteProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Load from localStorage cache on initial client mount
  React.useEffect(() => {
    try {
      const cached = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setFavoriteIds(parsed);
        }
      }
    } catch {
      // Ignore localStorage parse errors
    }
  }, []);

  // Fetch full favorite items from /api/favorites
  const refreshFavorites = React.useCallback(async () => {
    try {
      const res = await fetch("/api/favorites", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const prods: Product[] = json.data;
          setFavoriteProducts(prods);

          // Update favorite IDs
          const ids = prods
            .map((p) => p.id || p._id || "")
            .filter((id) => id.length > 0);

          setFavoriteIds((prev) => {
            // Merge with any optimistically added local IDs
            const merged = Array.from(new Set([...ids, ...prev]));
            try {
              localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(merged));
            } catch {
              // Ignore storage errors
            }
            return merged;
          });
        }
      }
    } catch (err) {
      console.warn("Could not fetch favorites from API, using local state:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  const isFavorite = React.useCallback(
    (productId: string): boolean => {
      if (!productId) return false;
      return favoriteIds.includes(productId);
    },
    [favoriteIds]
  );

  const addFavorite = async (productId: string): Promise<boolean> => {
    if (!productId) return false;

    // Optimistic update
    setFavoriteIds((prev) => {
      const next = Array.from(new Set([...prev, productId]));
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });

    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      refreshFavorites();
      return true;
    } catch (err) {
      console.warn("Failed to persist favorite to API:", err);
      return true; // Still true optimistically
    }
  };

  const removeFavorite = async (productId: string): Promise<boolean> => {
    if (!productId) return false;

    // Optimistic update
    setFavoriteIds((prev) => {
      const next = prev.filter((id) => id !== productId);
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });

    setFavoriteProducts((prev) =>
      prev.filter((p) => (p.id !== productId && p._id !== productId))
    );

    try {
      await fetch(`/api/favorites/${productId}`, {
        method: "DELETE",
      });
      return true;
    } catch (err) {
      console.warn("Failed to delete favorite from API:", err);
      return true;
    }
  };

  const toggleFavorite = async (productId: string): Promise<boolean> => {
    if (isFavorite(productId)) {
      await removeFavorite(productId);
      return false;
    } else {
      await addFavorite(productId);
      return true;
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        favoriteProducts,
        isFavorite,
        toggleFavorite,
        addFavorite,
        removeFavorite,
        favoritesCount: favoriteIds.length,
        isLoading,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = React.useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}

