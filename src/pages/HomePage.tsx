import { useEffect, useState } from "react";
import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import StatsBanner from "../components/StatsBanner";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import { movieService } from "../services/movieService.js";
import { GENRES } from "../data/genres";
import type { Movie } from "../types";

function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiveApi, setIsLiveApi] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] =
    useState<number | "all">("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] =
    useState<"grid" | "list">("grid");

  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const [selectedMovie, setSelectedMovie] =
    useState<Movie | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovies() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await movieService.fetchMovies({
          search,
          genre: selectedGenre,
          sort: sortBy,
          onlyFavorites,
          signal: controller.signal,
        });

        setMovies(data.results);
        setIsLiveApi(data.isLiveApi);
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === "AbortError"
        ) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load movies."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      controller.abort();
    };
  }, [
    search,
    selectedGenre,
    sortBy,
    onlyFavorites,
  ]);

  function handleToggleFavorites() {
    setOnlyFavorites((current) => !current);
  }

  const averageRating =
    movies.length === 0
      ? 0
      : movies.reduce(
          (total, movie) => total + movie.vote_average,
          0
        ) / movies.length;

  const activeGenre =
    selectedGenre === "all"
      ? "All Movies"
      : GENRES[selectedGenre] ?? "Unknown";

  return (
    <div className="app-layout">
      <Header
        search={search}
        onSearch={setSearch}
        onlyFavorites={onlyFavorites}
        onToggleFavorites={handleToggleFavorites}
      />

      <main className="main-container">
        <StatsBanner
          totalMovies={movies.length}
          averageRating={averageRating}
          activeGenre={activeGenre}
          isLiveApi={isLiveApi}
        />

        <FilterBar
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewChange={setViewMode}
        />

        {isLoading && <p>Loading...</p>}

        {error && (
          <p className="error-message">
            Error: {error}
          </p>
        )}

        {!isLoading && !error && (
          <>
            {movies.length === 0 ? (
              <p>No movies found.</p>
            ) : (
              <div
                className={`movie-grid ${
                  viewMode === "list" ? "list-view" : ""
                }`}
              >
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={() => setSelectedMovie(movie)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}

export default HomePage;