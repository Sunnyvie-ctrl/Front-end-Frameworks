import { useEffect, useState } from "react";
import { movieService } from "../services/movieService.js";
import type { Movie } from "../types";

type UseMoviesResult = {
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
};

export function useMovies(): UseMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovies() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await movieService.fetchMovies({
          signal: controller.signal,
        });

        setMovies(data.results);
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
  }, []);

  return {
    movies,
    isLoading,
    error,
  };
}