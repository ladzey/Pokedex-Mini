import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="state">
      <span className="state__glyph" aria-hidden="true">
        404
      </span>
      <h2 className="state__title">This route isn't in the dex</h2>
      <p className="state__body">
        The page you're looking for doesn't exist. Head back and pick a Pokémon.
      </p>
      <Link to="/" className="btn" viewTransition>
        Back to the dex
      </Link>
    </div>
  );
}

export default NotFoundPage;
