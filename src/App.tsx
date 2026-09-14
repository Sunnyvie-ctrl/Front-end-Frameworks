import MovieCard from "./components/MovieCard";
import { SAMPLE_MOVIES } from "./data/sampleMovies";

function App() {
  return (
    <div>
      <h1>Movie App</h1>

      <MovieCard movie={SAMPLE_MOVIES[0]} />
    </div>
  );
}

export default App;