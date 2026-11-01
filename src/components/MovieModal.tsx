import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Heart, Youtube } from "lucide-react";
import type { Movie } from "../types";
import { getPosterUrl, TMDB_BACKDROP_BASE } from "../data/sampleMovies";
import { getGenreNames } from "../data/genres";
import { useAppContext } from "../context/AppContext";

type MovieModalProps = {
  movie: Movie | null;
  onClose: () => void;
};

function MovieModal({ movie, onClose }: MovieModalProps) {
  const { isFavorite, toggleFavorite } = useAppContext();

  useEffect(() => {
    if (!movie) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [movie, onClose]);

  if (!movie) {
    return null;
  }

  const isFavourite = isFavorite(movie.id);
  const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
  const genres = getGenreNames(movie.genre_ids);
  const backdropUrl = movie.backdrop_path ? `${TMDB_BACKDROP_BASE}${movie.backdrop_path}` : undefined;
  const trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${movie.title} trailer`)}`;

  const modalContent = (
    <div
      className="modal-backdrop movie-modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 99999,
        backgroundColor: "rgba(0, 0, 0, 0.8)", 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)" 
      }}
    >

      <article className="movie-modal">
        {backdropUrl && (
          <div
            className="movie-modal-backdrop-image"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          />
        )}

        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={22} />
        </button>

        <div className="movie-modal-content">
          <img
            className="movie-modal-poster"
            src={getPosterUrl(movie.poster_path)}
            alt={movie.title}
          />

          <div className="movie-modal-info">
            <h2>{movie.title}</h2>

            {movie.original_title !== movie.title && (
              <p className="original-title">{movie.original_title}</p>
            )}

            <div className="movie-modal-meta">
              <span>{releaseYear}</span>
              <span>★ {movie.vote_average.toFixed(1)}</span>
              <span>{movie.vote_count.toLocaleString()} votes</span>
            </div>

            <div className="movie-genres-tags">
              {genres.map((genre) => (
                <span className="genre-tag" key={genre}>{genre}</span>
              ))}
            </div>

            <p className="movie-modal-overview">
              {movie.overview || "No overview available."}
            </p>

            <div className="movie-modal-actions">
              <button type="button" onClick={() => toggleFavorite(movie)}>
                <Heart size={18} fill={isFavourite ? "currentColor" : "none"} />
                {isFavourite ? "Remove from Watchlist" : "Add to Watchlist"}
              </button>

              <a href={trailerUrl} target="_blank" rel="noreferrer">
                <Youtube size={18} />
                Watch Trailer
              </a>
            </div>
          </div>
        </div>
      </article>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default MovieModal;