import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPokemon } from "../lib/api.js";
import { useFetch } from "../hooks/useFetch.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { capitalize, getSpriteUrl, getIdFromUrl, padId } from "../utils.js";

function SearchBox() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const boxRef = useRef(null);

  const { data } = useFetch(() => getAllPokemon(), []);
  const debounced = useDebounce(query, 180);

  const allEntries = useMemo(
    () =>
      (data?.results ?? []).map((entry) => ({
        name: entry.name,
        id: getIdFromUrl(entry.url),
      })),
    [data],
  );

  const suggestions = useMemo(() => {
    const needle = debounced.trim().toLowerCase();
    if (!needle) return [];
    return allEntries
      .filter(
        (entry) => entry.name.includes(needle) || String(entry.id) === needle,
      )
      .slice(0, 6);
  }, [debounced, allEntries]);

  // Close the dropdown when focus/click leaves the box.
  useEffect(() => {
    function onPointerDown(event) {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function go(name) {
    setQuery("");
    setIsOpen(false);
    setActiveIndex(-1);
    navigate(`/pokemon/${name}`);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const value = query.trim().toLowerCase();
    if (!value) return;

    if (activeIndex >= 0 && suggestions[activeIndex]) {
      go(suggestions[activeIndex].name);
      return;
    }
    const exact = allEntries.find((entry) => entry.name === value);
    if (exact) {
      go(exact.name);
      return;
    }
    if (suggestions[0]) {
      go(suggestions[0].name);
      return;
    }
    setIsOpen(false);
    navigate(`/?q=${encodeURIComponent(value)}`);
  }

  function handleKeyDown(event) {
    if (!isOpen || suggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <form className="search" onSubmit={handleSubmit} ref={boxRef} role="search">
      <span className="search__icon" aria-hidden="true">
        ⌕
      </span>
      <input
        className="search__input"
        type="text"
        value={query}
        placeholder="Search a Pokémon by name or number…"
        aria-label="Search a Pokémon"
        autoComplete="off"
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
      />

      {isOpen && suggestions.length > 0 && (
        <ul className="search__list" role="listbox">
          {suggestions.map((entry, index) => (
            <li key={entry.name}>
              <button
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={`search__option ${
                  index === activeIndex ? "is-active" : ""
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => go(entry.name)}
              >
                <img
                  src={getSpriteUrl(entry.id)}
                  alt=""
                  width={40}
                  height={40}
                  loading="lazy"
                />
                <span className="search__option-id">#{padId(entry.id)}</span>
                <span className="search__option-name">
                  {capitalize(entry.name)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

export default SearchBox;
