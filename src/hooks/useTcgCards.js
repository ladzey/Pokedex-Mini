import { useCallback, useEffect, useState } from "react";
import { getTcgCards } from "../lib/tcg.js";

const PAGE_SIZE = 20;

export function useTcgCards(dexId) {
  const [page, setPage] = useState(1);
  const [state, setState] = useState({
    cards: [],
    hasMore: true,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isCurrent = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => (prev.isLoading ? prev : { ...prev, isLoading: true }));

    getTcgCards(dexId, page, PAGE_SIZE)
      .then((batch) => {
        if (!isCurrent) return;
        setState((prev) => ({
          cards: page === 1 ? batch : [...prev.cards, ...batch],
          // TCGdex returns a bare array, so a short page means the end.
          hasMore: batch.length === PAGE_SIZE,
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
  }, [dexId, page]);

  const loadMore = useCallback(() => {
    if (state.hasMore && !state.isLoading) {
      setPage((current) => current + 1);
    }
  }, [state.hasMore, state.isLoading]);

  return { ...state, loadMore };
}
