import { Link } from "react-router-dom";
import { Film, Search, Heart, SlidersHorizontal } from "lucide-react";

function AboutPage() {
  return (
    <div className="app-layout">
      <main className="main-container about-page">
        <section className="about-hero">
          <div className="about-badge">
            <span className="logo-dot" />
            ABOUT CINE·GRID
          </div>

          <h1>
            Discover your next
            <span className="about-highlight"> favorite movie.</span>
          </h1>

          <p className="about-description">
            A simple, modern movie browser to explore films,
            discover new favorites, and build your personal watchlist.
          </p>

          <Link to="/" className="btn-primary">
            <Film size={18} />
            Explore Movies
          </Link>
        </section>

        <section className="about-features">
          <h2>Everything you need to explore</h2>

          <div className="about-feature-grid">
            <article className="about-feature-card">
              <div className="about-feature-icon">
                <Search size={22} />
              </div>
              <h3>Find Movies</h3>
              <p>
                Search for films and discover titles that interest you.
              </p>
            </article>

            <article className="about-feature-card">
              <div className="about-feature-icon">
                <SlidersHorizontal size={22} />
              </div>
              <h3>Explore Your Way</h3>
              <p>
                Filter by genre, sort by rating, and switch your viewing layout.
              </p>
            </article>

            <article className="about-feature-card">
              <div className="about-feature-icon">
                <Heart size={22} />
              </div>
              <h3>Save Favorites</h3>
              <p>
                Keep track of movies you want to watch again or discover later.
              </p>
            </article>
          </div>
        </section>

        <footer className="about-footer">
          <p>
            Built with React, TypeScript, React Router, and TMDB.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default AboutPage;