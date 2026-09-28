import { Link } from "react-router-dom";
import { capitalize, getArtworkUrl } from "../utils.js";

function conditionLabel(node) {
  if (node.minLevel) return `Lv. ${node.minLevel}`;
  if (node.item) return capitalize(node.item);
  if (node.trigger === "trade") return "Trade";
  if (node.trigger) return capitalize(node.trigger);
  return null;
}

function EvolutionChain({ stages }) {
  if (!stages || stages.length <= 1) {
    return <p className="muted">This Pokémon does not evolve.</p>;
  }

  return (
    <ol className="evolution">
      {stages.map((stage, stageIndex) => (
        <li key={stageIndex} className="evolution__stage">
          {stage.map((node) => (
            <Link
              key={node.id}
              to={`/pokemon/${node.name}`}
              className="evolution__node"
              viewTransition
            >
              <img
                src={getArtworkUrl(node.id)}
                alt={node.name}
                width={76}
                height={76}
                loading="lazy"
              />
              <span className="evolution__name">{capitalize(node.name)}</span>
              {conditionLabel(node) && (
                <span className="evolution__cond">{conditionLabel(node)}</span>
              )}
            </Link>
          ))}

          {stageIndex < stages.length - 1 && (
            <span className="evolution__arrow" aria-hidden="true">
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

export default EvolutionChain;
