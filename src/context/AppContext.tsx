import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import type { Movie, Theme } from "../types";
import { getFavorites, getTheme, setTheme, toggleFavorite as storageToggleFavorite } from "../utils/storage.js";

type AppState = {
  favorites: Movie[];
  theme: Theme;
};

type AppAction =
  | { type: "TOGGLE_FAVOURITE"; payload: Movie }
  | { type: "SET_THEME"; payload: Theme };

type AppContextType = {
  theme: Theme;
  toggleTheme: () => void;
  favorites: Movie[];
  toggleFavorite: (movie: Movie) => void;
  isFavorite: (id: number | string) => boolean;
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

      return {
        ...state,
        favorites: newFavorites,
      };
    }
    case "SET_THEME":
      return {
        ...state,
        theme: action.payload,
      };
    default:
      return state;
  }
}

type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, {
    favorites: getFavorites(),
    theme: getTheme() as Theme,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}