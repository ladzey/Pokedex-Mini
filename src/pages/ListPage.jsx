import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllPokemon, getType } from "../lib/api.js";
import { useFetch } from "../hooks/useFetch.js";
import { useInfiniteList } from "../hooks/useInfinite.js";
import { getIdFromUrl, capitalize } from "../utils.js";
import FilterBar from "../components/FilterBar.jsx";
import PokemonCard from "../components/PokemonCard.jsx";
import { CardSkeletonGrid } from "../components/Skeletons.jsx";
import { EmptyState, ErrorState } from "../components/States.jsx";
import PokeBallSpinner from "../components/PokeBallSpinner.jsx";

const GEN_RANGES = {
  1: [1, 151],
  2: [152, 251],
  3: [252, 386],
  4: [387, 493],
  5: [494, 649],
  6: [650, 721],
  7: [722, 809],
  8: [810, 905],
  9: [906, 1025],
};

const SORTERS = {
  "id-asc": (a, b) => a.id - b.id,
  "id-desc": (a, b) => b.id - a.id,
  "name-asc": (a, b) => a.name.localeCompare(b.name),
  "name-desc": (a, b) => b.name.localeCompare(a.name),
};

function ListPage() {
  const [params, setParams] = useSearchParams();

  const query = params.get("q") ?? "";
  const type = params.get("type") ?? "all";
  const gen = params.get("gen") ?? "all";
  const sort = params.get("sort") ?? "id-asc";

  const {
    data: listData,
    isLoading: isListLoading,
    error: listError,
  } = useFetch(() => getAllPokemon(), []);

  const { data: typeData, isLoading: isTypeLoading } = useFetch(
    () => (type === "all" ? Promise.resolve(null) : getType(type)),
    [type],
  );

  const entries = useMemo(
    () =>
      (listData?.results ?? []).map((entry) => ({
        name: entry.name,
        id: Number(getIdFromUrl(entry.url)),
      })),
    [listData],
  );

  const filtered = useMemo(() => {
    let items = entries;

    if (query.trim()) {
      const needle = query.trim().toLowerCase();
      items = items.filter(
        (entry) => entry.name.includes(needle) || String(entry.id) === needle,
      );
    }

    if (gen !== "all" && GEN_RANGES[gen]) {
      const [min, max] = GEN_RANGES[gen];
      items = items.filter((entry) => entry.id >= min && entry.id <= max);
    }

    if (type !== "all" && typeData) {
      const allowed = new Set(
        typeData.pokemon.map((slot) => slot.pokemon.name),
      );
      items = items.filter((entry) => allowed.has(entry.name));
    }

    return [...items].sort(SORTERS[sort] ?? SORTERS["id-asc"]);
  }, [entries, query, gen, type, typeData, sort]);

  const { count, sentinelRef, hasMore } = useInfiniteList(filtered.length, 24);
  const visible = filtered.slice(0, count);

  function updateParam(key, value) {
    const next = new URLSearchParams(params);
    if (value === "all" || value === "") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  }

  function resetFilters() {
    setParams(new URLSearchParams(), { replace: true });
  }

  if (listError) {
    return (
      <ErrorState
        title="Couldn't reach the Pokédex"
        message={`The server responded: ${listError}`}
      />
    );
  }

  if (isListLoading) {
    return (
      <>
        <PokeBallSpinner label="Booting Pokédex" />
        <CardSkeletonGrid count={12} />
      </>
    );
  }

  return (
    <>
      <div className="list-head">
        <h2 className="section-title">
          National Dex
          <span className="section-title__count">
            {filtered.length.toLocaleString()} entries
          </span>
        </h2>
        {query && (
          <p className="list-head__query">
            Filtering by “{query}”{" "}
            <button
              type="button"
              className="link-button"
              onClick={() => updateParam("q", "")}
            >
              clear
            </button>
          </p>
        )}
      </div>

      <FilterBar
        type={type}
        gen={gen}
        sort={sort}
        onType={(value) => updateParam("type", value)}
        onGen={(value) => updateParam("gen", value)}
        onSort={(value) => updateParam("sort", value)}
      />

      {isTypeLoading && type !== "all" && (
        <p className="muted">Loading {capitalize(type)} types…</p>
      )}

      {!isTypeLoading && filtered.length === 0 ? (
        <EmptyState onReset={resetFilters} />
      ) : (
        <>
          <ul className="pokemon-grid">
            {visible.map((entry, index) => (
              <PokemonCard key={entry.id} entry={entry} index={index} />
            ))}
          </ul>

          <div ref={sentinelRef} className="sentinel" aria-hidden="true" />

          {hasMore && <p className="muted center">Loading more…</p>}
        </>
      )}
    </>
  );
}

export default ListPage;
