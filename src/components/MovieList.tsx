import type { Movie } from "../types";
import MovieCard from "./MovieCard";

type MovieListProps = {
  movies: Movie[];
};

function MovieList({ movies }: MovieListProps) {
  if (movies.length === 0) {
    return <p>No movies found.</p>
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onClick={() => console.log(movie.title)}
        />
      ))}
    </div>
  );
}

export default MovieList;