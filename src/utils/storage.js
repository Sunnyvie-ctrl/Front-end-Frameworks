const FAVORITES_KEY = "movie-app-favorites";
const THEME_KEY = "movie-app-theme";
const API_KEY = "tmdb-api-key";

export function getFavorites() {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);

    if (!stored) return [];

    const favorites = JSON.parse(stored);

    return Array.isArray(favorites) ? favorites : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(movie) {
  const favorites = getFavorites();

  const exists = favorites.some(
    (favorite) => favorite.id === movie.id
  );

  const updatedFavorites = exists
    ? favorites.filter((favorite) => favorite.id !== movie.id)
    : [...favorites, movie];

  localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(updatedFavorites)
  );

  return updatedFavorites;
}

export function getTheme() {
  const theme = localStorage.getItem(THEME_KEY);

  return theme === "light" ? "light" : "dark";
}

export function setTheme(theme) {
  const validTheme = theme === "light" ? "light" : "dark";

  localStorage.setItem(THEME_KEY, validTheme);
  document.documentElement.setAttribute("data-theme", validTheme);
}

export function getApiKey() {
  return localStorage.getItem(API_KEY) || "";
}

export function setApiKey(key) {
  localStorage.setItem(API_KEY, key.trim());
}