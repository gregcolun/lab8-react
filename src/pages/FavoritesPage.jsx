import { Link } from "react-router-dom";
import MealCard from "../components/MealCard";

function FavoritesPage({ favorites, isFavorite, toggleFavorite }) {
  return (
    <section className="panel">
      <h1>Favorite</h1>
      <p className="state-info">
        Rețete salvate: <strong>{favorites.length}</strong>
      </p>

      {favorites.length === 0 && (
        <p className="status-box info">
          Nu ai încă favorite. Mergi la <Link to="/">pagina de căutare</Link>{" "}
          și adaugă câteva rețete.
        </p>
      )}

      {favorites.length > 0 && (
        <div className="card-grid">
          {favorites.map((meal) => (
            <MealCard
              key={meal.idMeal}
              meal={meal}
              isFavorite={isFavorite(meal.idMeal)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default FavoritesPage;
