import { SAMPLE_MOVIES } from "../data/sampleMovies";
import { getFavorites, getApiKey } from "../utils/storage";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export function sortMovies(movies, sort) {
  return [...movies].sort((a, b) => {
    switch (sort) {
      case "rating":
        return b.vote_average - a.vote_average;
      case "release_date":
        return (
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime()
        );
      case "title":
        return a.title.localeCompare(b.title);
      case "popularity":
      default:
        return b.popularity - a.popularity;
    }
  });
}

export const movieService = {
  async fetchMovies({
    search = "",
    genres = [], 
    sort = "popularity",
    onlyFavorites = false,
    page = 1,
    signal,
  } = {}) {
    if (onlyFavorites) {
      const favorites = getFavorites();
      const normalizedSearch = search.trim().toLowerCase();

      const filteredFavorites = favorites.filter((movie) => {
        const matchesSearch =
          !normalizedSearch ||
          movie.title.toLowerCase().includes(normalizedSearch);

        const matchesGenre =
          genres.length === 0 ||
          genres.every((g) => movie.genre_ids.includes(Number(g)));

        return matchesSearch && matchesGenre;
      });

      const results = sortMovies(filteredFavorites, sort);

      return {
        results,
        total_pages: 1,
        total_results: results.length,
        isLiveApi: false,
      };
    }

    const apiKey = getApiKey();

    if (!apiKey) {
      const normalizedSearch = search.trim().toLowerCase();

      const filteredMovies = SAMPLE_MOVIES.filter((movie) => {
        const matchesSearch =
          !normalizedSearch ||
          movie.title.toLowerCase().includes(normalizedSearch);

        const matchesGenre =
          genres.length === 0 ||
          genres.every((g) => movie.genre_ids.includes(Number(g)));

        return matchesSearch && matchesGenre;
      });

      const results = sortMovies(filteredMovies, sort);

      return {
        results,
        total_pages: 1,
        total_results: results.length,
        isLiveApi: false,
      };
    }

    let endpoint = "/movie/popular";

    if (search.trim()) {
      endpoint = "/search/movie";
    } else if (genres.length > 0) {
      endpoint = "/discover/movie";
    }

    const params = new URLSearchParams();

    params.set("api_key", apiKey);
    params.set("page", String(page));

    if (search.trim()) {
      params.set("query", search.trim());
    }

    if (endpoint === "/discover/movie" && genres.length > 0) {
      params.set("with_genres", genres.join(","));
    }

    const response = await fetch(
      `${TMDB_BASE_URL}${endpoint}?${params.toString()}`,
      {
        signal,
      }
    );

    if (!response.ok) {
      throw new Error(`TMDB request failed: ${response.status}`);
    }

    const data = await response.json();

    return {
      results: sortMovies(data.results ?? [], sort),
      total_pages: data.total_pages ?? 1,
      total_results: data.total_results ?? 0,
      isLiveApi: true,
    };
  },
};