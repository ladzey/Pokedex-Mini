import { Link } from "react-router-dom";
import { getPokemon } from "../lib/api.js";
import { useFetch } from "../hooks/useFetch.js";
import { useReveal } from "../hooks/useReveal.js";
import { capitalize, getSpriteUrl, padId } from "../utils.js";
import TypeBadge from "./TypeBadge.jsx";

function PokemonCard({ entry, index }) {
  const [ref, isVisible] = useReveal();
  const { data, isLoading } = useFetch(() => getPokemon(entry.id), [entry.id]);

  const types = data?.types?.map((slot) => slot.type.name) ?? [];
  const primaryType = types[0] ?? "normal";

  return (
    <li
      ref={ref}
      className={`pokemon-card ${isVisible ? "is-visible" : ""}`}
      data-type={primaryType}
      style={{ "--i": index % 24 }}
    >
      <Link
        to={`/pokemon/${entry.name}`}
        className="pokemon-card__link"
        viewTransition
      >
        <span className="pokemon-card__id">#{padId(entry.id)}</span>
        <span className="pokemon-card__art">
          <img
            className="pokemon-card__sprite"
            src={getSpriteUrl(entry.id)}
            alt=""
            width={96}
            height={96}
            loading="lazy"
          />
        </span>
        <span className="pokemon-card__name">{capitalize(entry.name)}</span>
        <span className="pokemon-card__types">
          {isLoading ? (
            <span className="type-badge type-badge--ghost">...</span>
          ) : (
            types.map((type) => <TypeBadge key={type} type={type} size="sm" />)
          )}
        </span>
      </Link>
    </li>
  );
}

export default PokemonCard;
