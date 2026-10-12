import type { Movie } from "../types";
import { getPosterUrl } from "../data/sampleMovies";
import { getGenreNames } from "../data/genres";
import { getFavorites, toggleFavorite } from "../utils/storage.js";
import { Heart } from "lucide-react";

type MovieCardProps = {
  movie: Movie;
  onClick: () => void;
};

function MovieCard({ movie, onClick }: MovieCardProps) {
  const isFavourite = getFavorites().some(
    (favorite) => favorite.id === movie.id
  );

  function handleFavourite(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    toggleFavorite(movie);
  }

  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : "N/A";

  const genreNames = getGenreNames(movie.genre_ids);

  return (
    <article
      className="movie-card"
      tabIndex={0}
      aria-label={`${movie.title} (${releaseYear})`}
      onClick={onClick}
    >
      <div className="poster-wrapper">
        <img
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          className="poster-img"
          loading="lazy"
        />

        <div className="poster-overlay">
          <div className="card-top-badges">
            <span className="rating-badge">
              <span>★</span>
              {movie.vote_average.toFixed(1)}
            </span>

            <button
              type="button"
              className={`favorite-btn ${
                isFavourite ? "is-favorite" : ""
              }`}
              title={
                isFavourite
                  ? "Remove from Watchlist"
                  : "Add to Watchlist"
              }
              aria-label={
                isFavourite
                  ? "Remove from Watchlist"
                  : "Add to Watchlist"
              }
              onClick={handleFavourite}
            >
              <Heart
                size={16}
                fill={isFavourite ? "currentColor" : "none"}
              />
            </button>
          </div>

          <span className="quick-view-hint">
            View Details
          </span>
        </div>
      </div>

      <div className="movie-card-info">
        <h2 className="movie-card-title">
          {movie.title}
        </h2>

        <div className="movie-card-meta">
          <span>{releaseYear}</span>
          <span>
            {movie.vote_count.toLocaleString()} votes
          </span>
        </div>

        <div className="movie-genres-tags">
          {genreNames.slice(0, 2).map((genre) => (
            <span className="genre-tag" key={genre}>
              {genre}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default MovieCard;