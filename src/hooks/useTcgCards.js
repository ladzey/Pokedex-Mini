import { useCallback, useEffect, useState } from "react";
import { getTcgCards } from "../lib/tcg.js";

const PAGE_SIZE = 20;

export function useTcgCards(pokemonName) {
  const [page, setPage] = useState(1);
  const [state, setState] = useState({
    cards: [],
    total: 0,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isCurrent = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => (prev.isLoading ? prev : { ...prev, isLoading: true }));

    getTcgCards(pokemonName, page, PAGE_SIZE)
      .then((data) => {
        if (!isCurrent) return;
        setState((prev) => ({
          cards:
            page === 1
              ? (data.data ?? [])
              : [...prev.cards, ...(data.data ?? [])],
          total: data.totalCount ?? 0,
          isLoading: false,
          error: null,
        }));
      })
      .catch((err) => {
        if (!isCurrent) return;
        setState((prev) => ({ ...prev, isLoading: false, error: err.message }));
      });

    return () => {
      isCurrent = false;
    };
  }, [pokemonName, page]);

  const hasMore = page * PAGE_SIZE < state.total;

  const loadMore = useCallback(() => {
    setPage((current) =>
      current * PAGE_SIZE < state.total ? current + 1 : current,
    );
  }, [state.total]);

  return { ...state, hasMore, loadMore };
}
