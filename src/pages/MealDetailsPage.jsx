import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";

const API_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

function collectIngredients(meal) {
  const items = [];

  for (let index = 1; index <= 20; index += 1) {
    const ingredient = meal[`strIngredient${index}`]?.trim();
    const measure = meal[`strMeasure${index}`]?.trim();

    if (!ingredient) {
      continue;
    }

    items.push(measure ? `${ingredient} - ${measure}` : ingredient);
  }

  return items;
}

function MealDetailsPage({ isFavorite, toggleFavorite }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const backLink = location.state?.from || "/";

  const { data, loading, error } = useFetch(`${API_BASE_URL}/lookup.php?i=${id}`, {
    cacheKey: `meal-details-${id}`,
    ttl: 10 * 60 * 1000
  });

  const meal = data?.meals?.[0] || null;
  const ingredients = meal ? collectIngredients(meal) : [];

  return (
    <section className="panel">
      <button type="button" className="back-btn" onClick={() => navigate(backLink)}>
        Înapoi la listă
      </button>

      {loading && <p className="status-box loading">Se încarcă detaliile...</p>}
      {error && <p className="status-box error">{error}</p>}
      {!loading && !error && !meal && (
        <p className="status-box info">Rețeta nu a fost găsită.</p>
      )}

      {meal && (
        <article className="details-card">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="details-image"
          />

          <div className="details-content">
            <h1>{meal.strMeal}</h1>
            <p className="details-meta">
              {meal.strCategory} • {meal.strArea}
            </p>

            <button
              type="button"
              className="favorite-btn"
              onClick={() => toggleFavorite(meal)}
            >
              {isFavorite(meal.idMeal)
                ? "Scoate din favorite"
                : "Adaugă la favorite"}
            </button>

            <h2>Ingrediente</h2>
            <ul className="ingredients-list">
              {ingredients.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2>Instrucțiuni</h2>
            <p className="instructions">{meal.strInstructions}</p>

            {meal.strYoutube && (
              <a
                href={meal.strYoutube}
                target="_blank"
                rel="noreferrer"
                className="video-link"
              >
                Deschide rețeta video
              </a>
            )}
          </div>
        </article>
      )}
    </section>
  );
}

export default MealDetailsPage;
