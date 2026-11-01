import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Heart, Youtube, Star } from "lucide-react";
import type { Movie } from "../types";
import { getPosterUrl, TMDB_BACKDROP_BASE } from "../data/sampleMovies";
import { getGenreNames } from "../data/genres";
import { useAppContext } from "../context/AppContext";

type MovieModalProps = {
  movie: Movie | null;
  onClose: () => void;
};

function MovieModal({ movie, onClose }: MovieModalProps) {
  const { isFavorite, toggleFavorite, reviews, addReview } = useAppContext();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Clear form when opening a new movie
  useEffect(() => {
    setRating(0);
    setComment("");
  }, [movie]);

  useEffect(() => {
    if (!movie) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [movie, onClose]);

  if (!movie) return null;

  const isFavourite = isFavorite(movie.id);
  const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
  const genres = getGenreNames(movie.genre_ids);
  const backdropUrl = movie.backdrop_path ? `${TMDB_BACKDROP_BASE}${movie.backdrop_path}` : undefined;
  const trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${movie.title} trailer`)}`;

  // Grab the array of existing reviews for this specific movie
  const movieReviews = Array.isArray(reviews[movie.id]) ? reviews[movie.id] : [];
  
  function handleSaveReview() {
    if (rating === 0 && !comment.trim()) return; 
    
    addReview(movie!.id, {
      id: crypto.randomUUID(), // Generates a unique ID
      rating,
      comment,
      timestamp: new Date().toLocaleDateString(),
    });
    
    // Reset the form so you can add another comment immediately
    setRating(0);
    setComment("");
  }

  const modalContent = (
    <div
      className="modal-backdrop movie-modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
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

        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
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
            <div className="movie-modal-meta">
              <span>{releaseYear}</span>
              <span>★ {movie.vote_average.toFixed(1)}</span>
            </div>

            <div className="movie-genres-tags">
              {genres.map((genre) => (
                <span className="genre-tag" key={genre}>{genre}</span>
              ))}
            </div>

            <p className="movie-modal-overview">
              {movie.overview || "No overview available."}
            </p>

            {/* --- MULTIPLE REVIEWS SECTION --- */}
            <div className="user-review-section" style={{ marginTop: "24px", padding: "16px", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: "12px", maxHeight: "250px", overflowY: "auto" }}>
              <h3 style={{ fontSize: "1rem", marginBottom: "12px" }}>Community Reviews ({movieReviews.length})</h3>
              
              {/* List all previous comments */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                {movieReviews.map((rev) => (
                  <div key={rev.id} style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ color: "var(--accent)" }}>
                        {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "#888" }}>{rev.timestamp}</span>
                    </div>
                    {rev.comment && <p style={{ margin: 0, fontSize: "0.9rem", color: "#ddd" }}>{rev.comment}</p>}
                  </div>
                ))}
              </div>
              
              {/* Form to add a new comment */}
              <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    fill={star <= rating ? "var(--accent)" : "none"}
                    color={star <= rating ? "var(--accent)" : "#666"}
                    style={{ cursor: "pointer" }}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add another review..."
                style={{
                  width: "100%",
                  height: "60px",
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.1)",
                  marginBottom: "12px",
                  resize: "none"
                }}
              />

              <button
                type="button"
                onClick={handleSaveReview}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Post Review
              </button>
            </div>

            <div className="movie-modal-actions">
              <button type="button" onClick={() => toggleFavorite(movie)}>
                <Heart size={18} fill={isFavourite ? "currentColor" : "none"} />
                {isFavourite ? "Remove Watchlist" : "Add Watchlist"}
              </button>
              <a href={trailerUrl} target="_blank" rel="noreferrer">
                <Youtube size={18} />
                Trailer
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