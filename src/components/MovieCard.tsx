import { useState } from "react";
import type { Movie } from "../types";
import { getPosterUrl } from "../data/sampleMovies";

type MovieCardProps = {
  movie: Movie;
  onClick: () => void;
};

function MovieCard({ movie, onClick }: MovieCardProps) {
  const [isFavourite, setIsFavourite] = useState(false);

  return (
    <div className="movie-card" onClick={onClick}>
      <div className="poster-wrapper">
        <img
          className="poster-img"
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
        />

        <div className="poster-overlay">
          <div className="movie-rating">
            ⭐ {movie.vote_average.toFixed(1)}
          </div>

          <button
            onClick={(event) => {
              event.stopPropagation();
              setIsFavourite(!isFavourite);
            }}
          >
            {isFavourite ? "♥ Remove from Favourites" : "♡ Add to Favourites"}
          </button>
        </div>
      </div>

      <h2>{movie.title}</h2>
    </div>
  );
}

export default MovieCard;