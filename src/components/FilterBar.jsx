import { ALL_TYPES, capitalize } from "../utils.js";

const GENERATIONS = [
  { value: "all", label: "All generations" },
  { value: "1", label: "Gen I · Kanto" },
  { value: "2", label: "Gen II · Johto" },
  { value: "3", label: "Gen III · Hoenn" },
  { value: "4", label: "Gen IV · Sinnoh" },
  { value: "5", label: "Gen V · Unova" },
  { value: "6", label: "Gen VI · Kalos" },
  { value: "7", label: "Gen VII · Alola" },
  { value: "8", label: "Gen VIII · Galar" },
  { value: "9", label: "Gen IX · Paldea" },
];

const SORTS = [
  { value: "id-asc", label: "Number ↑" },
  { value: "id-desc", label: "Number ↓" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
];

function FilterBar({ type, gen, sort, onType, onGen, onSort }) {
  return (
    <div className="filter-bar">
      <div
        className="filter-bar__types"
        role="group"
        aria-label="Filter by type"
      >
        <button
          type="button"
          className="chip chip--all"
          aria-pressed={type === "all"}
          onClick={() => onType("all")}
        >
          All
        </button>
        {ALL_TYPES.map((typeName) => (
          <button
            key={typeName}
            type="button"
            className="chip"
            data-type={typeName}
            aria-pressed={type === typeName}
            onClick={() => onType(typeName)}
          >
            {capitalize(typeName)}
          </button>
        ))}
      </div>

      <div className="filter-bar__selects">
        <label className="select">
          <span className="select__label">Generation</span>
          <select value={gen} onChange={(e) => onGen(e.target.value)}>
            {GENERATIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="select">
          <span className="select__label">Sort</span>
          <select value={sort} onChange={(e) => onSort(e.target.value)}>
            {SORTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

export default FilterBar;
