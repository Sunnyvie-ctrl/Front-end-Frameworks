import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import type { Movie, Theme } from "../types";
import { getFavorites, getTheme, setTheme, getReviews } from "../utils/storage.js";

// Id and timestamp to track multiple distinct reviews
export type UserReview = { id: string; rating: number; comment: string; timestamp: string };

type AppState = {
  favorites: Movie[];
  theme: Theme;
  reviews: Record<number, UserReview[]>; 
};

type AppAction =
  | { type: "TOGGLE_FAVOURITE"; payload: Movie }
  | { type: "SET_THEME"; payload: Theme }
  | { type: "ADD_REVIEW"; payload: { movieId: number; review: UserReview } };

type AppContextType = {
  theme: Theme;
  toggleTheme: () => void;
  favorites: Movie[];
  toggleFavorite: (movie: Movie) => void;
  isFavorite: (id: number | string) => boolean;
  reviews: Record<number, UserReview[]>;
  addReview: (movieId: number, review: UserReview) => void;
};

const AppContext = createContext<AppContextType | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "TOGGLE_FAVOURITE": {
      const exists = state.favorites.some((fav) => String(fav.id) === String(action.payload.id));
      const newFavorites = exists 
        ? state.favorites.filter((fav) => String(fav.id) !== String(action.payload.id))
        : [...state.favorites, action.payload];

      localStorage.setItem("movie-app-favorites", JSON.stringify(newFavorites));
      return { ...state, favorites: newFavorites };
    }
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "ADD_REVIEW": {
      const { movieId, review } = action.payload;
      const existingReviews = state.reviews[movieId] || [];
      
      // Append the new review to the existing array
      const updatedReviews = {
        ...state.reviews,
        [movieId]: [...existingReviews, review],
      };
      
      // Save directly to storage
      localStorage.setItem("movie-app-reviews", JSON.stringify(updatedReviews));
      
      return {
        ...state,
        reviews: updatedReviews,
      };
    }
    default:
      return state;
  }
}

type AppProviderProps = { children: ReactNode };

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, {
    favorites: getFavorites(),
    theme: getTheme() as Theme,
    reviews: getReviews() || {},
  });

  useEffect(() => {
    setTheme(state.theme);
  }, [state.theme]);

  function toggleTheme() {
    const nextTheme: Theme = state.theme === "dark" ? "light" : "dark";
    dispatch({ type: "SET_THEME", payload: nextTheme });
  }

  function toggleFavorite(movie: Movie) {
    dispatch({ type: "TOGGLE_FAVOURITE", payload: movie });
  }

  function addReview(movieId: number, review: UserReview) {
    dispatch({ type: "ADD_REVIEW", payload: { movieId, review } });
  }

  function isFavorite(id: number | string) {
    return state.favorites.some((fav) => String(fav.id) === String(id));
  }

  return (
    <AppContext.Provider
      value={{
        theme: state.theme,
        toggleTheme,
        favorites: state.favorites,
        toggleFavorite,
        isFavorite,
        reviews: state.reviews,
        addReview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppProvider");
  return context;
}