import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="app-layout">
      <main className="main-container">
        <h1>404</h1>

        <p>
          Page not found. Sorry, the page you are looking for does not exist.
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </main>
    </div>
  );
}

export default NotFoundPage;