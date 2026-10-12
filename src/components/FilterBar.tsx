import { Grid2X2, List } from "lucide-react";
import { GENRES } from "../data/genres";

type FilterBarProps = {
  selectedGenre: number | "all";
  onGenreChange: (genre: number | "all") => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
};

function FilterBar({
  selectedGenre,
  onGenreChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewChange,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="genre-pills-scroll">
        <button
          type="button"
          className={`genre-pill ${
            selectedGenre === "all" ? "active" : ""
          }`}
          onClick={() => onGenreChange("all")}
        >
          All Movies
        </button>

        {Object.entries(GENRES).map(([id, name]) => (
          <button
            type="button"
            key={id}
            className={`genre-pill ${
              selectedGenre === Number(id) ? "active" : ""
            }`}
            onClick={() => onGenreChange(Number(id))}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="filter-actions-right">
        <div className="sort-select-wrapper">
          <select
            className="sort-select"
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
            aria-label="Sort movies by"
          >
            <option value="popularity">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="release_date">Release Date</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>

        <div className="view-toggle-group">
          <button
            type="button"
            className={`view-btn ${
              viewMode === "grid" ? "active" : ""
            }`}
            onClick={() => onViewChange("grid")}
            title="Grid View"
            aria-label="Grid View"
          >
            <Grid2X2 size={18} />
          </button>

          <button
            type="button"
            className={`view-btn ${
              viewMode === "list" ? "active" : ""
            }`}
            onClick={() => onViewChange("list")}
            title="List View"
            aria-label="List View"
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;