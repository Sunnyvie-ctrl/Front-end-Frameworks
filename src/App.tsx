import { useState } from "react";
import MovieList from "./components/MovieList";
import SearchBar from "./components/SearchBar";
import { SAMPLE_MOVIES } from "./data/sampleMovies";

function App() {
  const [movies] = useState(SAMPLE_MOVIES);
  const [query, setQuery] = useState("");
  const [minRating, setMinRating] = useState(0);

  const filteredMovies = movies.filter((movie) => {
    const matchesQuery = movie.title
      .toLowerCase()
      .includes(query.toLowerCase());

    const matchesRating = movie.vote_average >= minRating;

    return matchesQuery && matchesRating;
  });

  return (
    <div className="app-layout">
      <header className="site-header">
        <div className="header-inner">
          <div className="brand-logo">
            <span className="logo-dot"></span>
            <h1 className="logo-text">Movie App</h1>
            <span className="brand-badge">Movies</span>
          </div>

          <div className="header-search">
            <SearchBar
              query={query}
              onChange={setQuery}
            />
          </div>
        </div>
      </header>

      <main className="main-container">
        <div className="filter-bar">
          <div>
            <label htmlFor="rating">
              Minimum rating: {minRating.toFixed(1)}
            </label>

            <input
              id="rating"
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={minRating}
              onChange={(event) =>
                setMinRating(Number(event.target.value))
              }
            />
          </div>
        </div>

        <MovieList movies={filteredMovies} />
      </main>
    </div>
  );
}

export default App;