import { Link } from "react-router-dom";
import PokeBallSpinner from "./PokeBallSpinner.jsx";

export function ErrorState({ title = "Scan failed", message, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <span className="state__glyph" aria-hidden="true">
        ⚠
      </span>
      <h2 className="state__title">{title}</h2>
      <p className="state__body">{message}</p>
      <div className="state__actions">
        {onRetry && (
          <button type="button" className="btn" onClick={onRetry}>
            Try again
          </button>
        )}
        <Link to="/" className="btn btn--ghost">
          Back to the dex
        </Link>
      </div>
    </div>
  );
}

export function EmptyState({ onReset }) {
  return (
    <div className="state">
      <span className="state__glyph" aria-hidden="true">
        ?
      </span>
      <h2 className="state__title">No Pokémon match those filters</h2>
      <p className="state__body">
        Try a different type or generation, or clear the filters.
      </p>
      {onReset && (
        <button type="button" className="btn" onClick={onReset}>
          Clear filters
        </button>
      )}
    </div>
  );
}

export { PokeBallSpinner };
