import type { Movie } from "../types";
import { getPosterUrl } from "../data/sampleMovies";
import { getGenreNames } from "../data/genres";
import { useAppContext } from "../context/AppContext";
import { Heart } from "lucide-react";

type MovieCardProps = {
  movie: Movie;
  onClick: () => void;
};

function MovieCard({ movie, onClick }: MovieCardProps) {
  const { isFavorite, toggleFavorite } = useAppContext();
  const isFavourite = isFavorite(movie.id);

  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : "N/A";

  const genreNames = getGenreNames(movie.genre_ids);

  return (
    <article
      className="movie-card"
      tabIndex={0}
      style={{ position: "relative" }}
    >
      <div
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") onClick();
        }}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          cursor: "pointer",
        }}
        title="View Details"
      />

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
              style={{
                position: "relative",
                zIndex: 10,
              }}
              title={
                isFavourite
                  ? "Remove from Watchlist"
                  : "Add to Watchlist"
              }
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(movie);
              }}
            >
              <Heart
                size={16}
                fill={isFavourite ? "currentColor" : "none"}
                style={{ pointerEvents: "none" }}
              />
            </button>
          </div>

          <span className="quick-view-hint" style={{ position: "relative", zIndex: 4 }}>
            View Details
          </span>
        </div>
      </div>

      <div className="movie-card-info" style={{ position: "relative", zIndex: 4 }}>
        <h2 className="movie-card-title">{movie.title}</h2>
        <div className="movie-card-meta">
          <span>{releaseYear}</span>
          <span>{movie.vote_count.toLocaleString()} votes</span>
        </div>
        <div className="movie-genres-tags">
          {genreNames.slice(0, 2).map((genre) => (
            <span className="genre-tag" key={genre}>{genre}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default MovieCard;