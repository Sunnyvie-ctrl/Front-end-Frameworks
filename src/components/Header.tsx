import {
  Search,
  X,
  Heart,
  Sun,
  Moon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import type { Theme } from "../types";

type HeaderProps = {
  search: string;
  onSearch: (value: string) => void;
  onlyFavorites: boolean;
  onToggleFavorites: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  favCount: number;
};

function Header({
  search,
  onSearch,
  onlyFavorites,
  onToggleFavorites,
  theme,
  onToggleTheme,
  favCount,
}: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand-logo">
          <div className="logo-dot"></div>

          <span className="logo-text">CINE·GRID</span>

          <span className="brand-badge">React</span>
        </div>

        <nav className="site-nav">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>

          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
        </nav>

        <div className="header-search">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />

            <input
              type="text"
              id="search-input"
              className="search-input"
              placeholder="Search movies, plot keywords, titles..."
              value={search}
              autoComplete="off"
              onChange={(event) => onSearch(event.target.value)}
            />

            {search && (
              <button
                type="button"
                className="search-clear-btn"
                title="Clear search"
                onClick={() => onSearch("")}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className={`btn-icon-label ${
              onlyFavorites ? "active" : ""
            }`}
            onClick={onToggleFavorites}
          >
            <Heart size={18} />

            <span>Watchlist</span>

            <span className="count-badge">{favCount}</span>
          </button>


          <button
            type="button"
            className="theme-toggle-btn"
            title="Toggle theme"
            onClick={onToggleTheme}
          >
            {theme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;