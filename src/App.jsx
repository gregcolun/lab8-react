import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { useFavorites } from "./hooks/useFavorites";
import HomePage from "./pages/HomePage";
import MealDetailsPage from "./pages/MealDetailsPage";
import FavoritesPage from "./pages/FavoritesPage";

function linkClassName({ isActive }) {
  return isActive ? "nav-link active" : "nav-link";
}

function App() {
  const favoritesApi = useFavorites();

  return (
    <div className="app-shell">
      <header className="topbar">
        <p className="brand">Retete React</p>
        <nav className="nav-links">
          <NavLink to="/" className={linkClassName}>
            Căutare
          </NavLink>
          <NavLink to="/favorites" className={linkClassName}>
            Favorite ({favoritesApi.favorites.length})
          </NavLink>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<HomePage {...favoritesApi} />} />
          <Route path="/meal/:id" element={<MealDetailsPage {...favoritesApi} />} />
          <Route path="/favorites" element={<FavoritesPage {...favoritesApi} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
