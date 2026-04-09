import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "meal-favorites-v1";

function readInitialFavorites() {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return [];
    }
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeMeal(meal) {
  if (!meal || !meal.idMeal) {
    return null;
  }

  return {
    idMeal: String(meal.idMeal),
    strMeal: meal.strMeal || "Unknown meal",
    strMealThumb: meal.strMealThumb || "",
    strCategory: meal.strCategory || "N/A",
    strArea: meal.strArea || "N/A"
  };
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(readInitialFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const favoriteIds = useMemo(
    () => new Set(favorites.map((meal) => String(meal.idMeal))),
    [favorites]
  );

  function isFavorite(mealId) {
    return favoriteIds.has(String(mealId));
  }

  function toggleFavorite(meal) {
    const safeMeal = normalizeMeal(meal);
    if (!safeMeal) {
      return;
    }

    setFavorites((current) => {
      const exists = current.some((item) => item.idMeal === safeMeal.idMeal);
      if (exists) {
        return current.filter((item) => item.idMeal !== safeMeal.idMeal);
      }
      return [safeMeal, ...current];
    });
  }

  function removeFavorite(mealId) {
    setFavorites((current) =>
      current.filter((item) => item.idMeal !== String(mealId))
    );
  }

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite
  };
}

