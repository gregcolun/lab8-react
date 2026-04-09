import { Link, useLocation } from "react-router-dom";

function MealCard({ meal, isFavorite, onToggleFavorite }) {
  const location = useLocation();
  const backLink = `${location.pathname}${location.search}`;

  return (
    <article className="card">
      <img
        src={meal.strMealThumb || "https://placehold.co/600x400?text=No+Image"}
        alt={meal.strMeal}
        className="card-image"
        loading="lazy"
      />

      <div className="card-body">
        <h3>{meal.strMeal}</h3>
        <p>
          {meal.strCategory || "N/A"} • {meal.strArea || "N/A"}
        </p>

        <div className="card-actions">
          <button
            type="button"
            className="favorite-btn"
            onClick={() => onToggleFavorite(meal)}
          >
            {isFavorite ? "Scoate din favorite" : "Adaugă la favorite"}
          </button>

          <Link
            to={`/meal/${meal.idMeal}`}
            state={{ from: backLink }}
            className="details-link"
          >
            Vezi detalii
          </Link>
        </div>
      </div>
    </article>
  );
}

export default MealCard;
