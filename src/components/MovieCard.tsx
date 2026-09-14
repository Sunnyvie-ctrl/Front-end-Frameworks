import { getPosterUrl } from "../data/sampleMovies";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
};

type MovieCardProps = {
  movie: Movie;
};

function MovieCard({ movie }: MovieCardProps) {
  return (
    <div>
      <h2>{movie.title}</h2>

      <img
        src={getPosterUrl(movie.poster_path)}
        alt={movie.title}
        width="200"
      />
    </div>
  );
}

export default MovieCard;