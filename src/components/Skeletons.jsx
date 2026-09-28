export function CardSkeletonGrid({ count = 12 }) {
  return (
    <ul className="pokemon-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <li key={index} className="pokemon-card skeleton-card">
          <span className="skeleton skeleton--id" />
          <span className="skeleton skeleton--sprite" />
          <span className="skeleton skeleton--name" />
          <span className="skeleton skeleton--type" />
        </li>
      ))}
    </ul>
  );
}

export function DetailSkeleton() {
  return (
    <div className="detail-page" aria-hidden="true">
      <span className="skeleton skeleton--title" />
      <div className="detail-hero">
        <span className="skeleton skeleton--hero" />
        <div className="detail-hero__info">
          <span className="skeleton skeleton--line" />
          <span className="skeleton skeleton--line" />
          <span className="skeleton skeleton--line short" />
        </div>
      </div>
    </div>
  );
}
