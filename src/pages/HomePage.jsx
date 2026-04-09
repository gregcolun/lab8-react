import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import MealCard from "../components/MealCard";
import PaginationControls from "../components/PaginationControls";
import SearchFilters from "../components/SearchFilters";
import { useFetch } from "../hooks/useFetch";

const API_BASE_URL = "https://www.themealdb.com/api/json/v1/1";
const ALL_CATEGORIES = "Toate";
const PAGE_SIZE = 8;

function toPositiveInt(value, fallback = 1) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return Math.floor(parsed);
}

function HomePage({ isFavorite, toggleFavorite }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || ALL_CATEGORIES;
  const page = toPositiveInt(searchParams.get("page"), 1);

  const searchUrl = `${API_BASE_URL}/search.php?s=${encodeURIComponent(query)}`;
  const {
    data: mealsData,
    loading: mealsLoading,
    error: mealsError
  } = useFetch(searchUrl, { ttl: 5 * 60 * 1000 });

  const { data: categoriesData, error: categoriesError } = useFetch(
    `${API_BASE_URL}/list.php?c=list`,
    { ttl: 60 * 60 * 1000, cacheKey: "meal-categories" }
  );

  const categories = useMemo(() => {
    const fromApi = (categoriesData?.meals || [])
      .map((item) => item.strCategory)
      .filter(Boolean);
    return [ALL_CATEGORIES, ...fromApi];
  }, [categoriesData]);

  const meals = mealsData?.meals || [];
  const filteredMeals = useMemo(() => {
    if (category === ALL_CATEGORIES) {
      return meals;
    }
    return meals.filter((meal) => meal.strCategory === category);
  }, [meals, category]);

  const totalItems = filteredMeals.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const mealsOnPage = filteredMeals.slice(startIndex, startIndex + PAGE_SIZE);

  function updateParams(values) {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(values).forEach(([key, value]) => {
      const shouldRemove =
        value === null ||
        value === undefined ||
        value === "" ||
        (key === "category" && value === ALL_CATEGORIES) ||
        (key === "page" && Number(value) <= 1);

      if (shouldRemove) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });

    setSearchParams(nextParams);
  }

  function handleQueryChange(nextValue) {
    updateParams({ q: nextValue, page: 1 });
  }

  function handleCategoryChange(nextValue) {
    updateParams({ category: nextValue, page: 1 });
  }

  function handlePageChange(nextPage) {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    updateParams({ page: safePage });
  }

  return (
    <section className="panel">
      <h1>Explorare Rețete din API Public</h1>
      <p className="intro">
        Caută rețete, combină cu filtrul pe categorie, deschide detalii și
        salvează favoritele.
      </p>

      <SearchFilters
        query={query}
        category={category}
        categories={categories}
        onQueryChange={handleQueryChange}
        onCategoryChange={handleCategoryChange}
      />

      <p className="state-info">
        Total rezultate: <strong>{totalItems}</strong> | Pagina curentă:{" "}
        <strong>{currentPage}</strong>
      </p>

      {categoriesError && (
        <p className="status-box error">
          Lista categoriilor nu a putut fi încărcată. Poți continua căutarea.
        </p>
      )}

      {mealsLoading && (
        <p className="status-box loading">Se încarcă rețetele...</p>
      )}

      {mealsError && <p className="status-box error">{mealsError}</p>}

      {!mealsLoading && !mealsError && totalItems === 0 && (
        <p className="status-box info">
          Nu există rezultate pentru această combinație de căutare + filtru.
        </p>
      )}

      {!mealsLoading && !mealsError && totalItems > 0 && (
        <>
          <div className="card-grid">
            {mealsOnPage.map((meal) => (
              <MealCard
                key={meal.idMeal}
                meal={meal}
                isFavorite={isFavorite(meal.idMeal)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>

          <PaginationControls
            page={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
}

export default HomePage;
