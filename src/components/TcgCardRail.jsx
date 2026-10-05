import { useEffect, useRef } from "react";
import { useTcgCards } from "../hooks/useTcgCards.js";
import { capitalize } from "../utils.js";

function TcgCardRail({ pokemonName }) {
  const { cards, isLoading, error, hasMore, loadMore } =
    useTcgCards(pokemonName);
  const sentinelRef = useRef(null);

  // Load the next page when the sentinel scrolls into view.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "400px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  if (error) {
    return (
      <p className="rail__status">
        Couldn't load trading cards right now. Try again later.
      </p>
    );
  }

  if (!isLoading && cards.length === 0) {
    return (
      <p className="rail__status">
        No trading cards found for {capitalize(pokemonName)}.
      </p>
    );
  }

  const skeletons = Array.from({ length: 6 }, (_, index) => `s${index}`);

  return (
    <div className="rail">
      <ul className="rail__track">
        {cards.length === 0
          ? skeletons.map((key) => (
              <li key={key} className="rail__item">
                <span className="rail__skeleton" aria-hidden="true" />
              </li>
            ))
          : cards.map((card) => (
              <li key={card.id} className="rail__item">
                <a
                  className="tcg-card"
                  href={card.images.large}
                  target="_blank"
                  rel="noreferrer"
                  title={`${card.name} — ${card.set?.name ?? ""}`}
                >
                  <img
                    className="tcg-card__img"
                    src={card.images.small}
                    alt={`${card.name} trading card`}
                    loading="lazy"
                    width={170}
                    height={238}
                  />
                  <span className="tcg-card__meta">
                    #{card.number} · {card.rarity ?? "—"}
                  </span>
                </a>
              </li>
            ))}

        {hasMore && <li ref={sentinelRef} className="rail__sentinel" />}
      </ul>

      {isLoading && cards.length > 0 && (
        <p className="rail__status">Loading more cards…</p>
      )}
    </div>
  );
}

export default TcgCardRail;
