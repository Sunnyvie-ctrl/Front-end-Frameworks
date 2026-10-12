import { Film, Star, Filter, Database } from "lucide-react";

type StatsBannerProps = {
  totalMovies: number;
  averageRating: number;
  activeGenre: string;
  isLiveApi: boolean;
};

function StatsBanner({
  totalMovies,
  averageRating,
  activeGenre,
  isLiveApi,
}: StatsBannerProps) {
  return (
        <section className="stats-banner">
        <div className="stat-card">
        <div className="stat-icon">
        <Film size={22} />
        </div>
        <div className="stat-info">
        <span className="stat-value">{totalMovies}</span>
        <span className="stat-label">Available Titles</span>
        </div>
        </div>

          <div className="stat-card">
            <div className="stat-icon star-icon">
              <Star size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value">
                {averageRating.toFixed(1)} / 10
              </span>
              <span className="stat-label">Avg Page Rating</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Filter size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value genre-value">
                {activeGenre}
              </span>
              <span className="stat-label">Selected Category</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon database-icon">
              <Database size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-value engine-value">
                {isLiveApi ? "TMDB API" : "Cached Local DB"}
              </span>
              <span className="stat-label">Data Engine</span>
            </div>
          </div>
        </section>
  );
}

export default StatsBanner;