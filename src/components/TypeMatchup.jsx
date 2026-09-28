import { groupMatchups } from "../utils.js";
import TypeBadge from "./TypeBadge.jsx";

function Multiplier({ value }) {
  return <span className="matchup__mult">x{value}</span>;
}

function MatchupRow({ label, items }) {
  if (items.length === 0) {
    return (
      <div className="matchup__row">
        <span className="matchup__label">{label}</span>
        <span className="matchup__none">-</span>
      </div>
    );
  }

  return (
    <div className="matchup__row">
      <span className="matchup__label">{label}</span>
      <div className="matchup__items">
        {items.map((item) => (
          <span key={item.type} className="matchup__item">
            {" "}
            <TypeBadge type={item.type} size="sm" />{" "}
            {typeof item.multiplier === "number" && (
              <Multiplier value={item.multiplier} />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

function TypeMatchup({ matchups }) {
  const { weak, resist, immune } = groupMatchups(matchups);

  return (
    <div className="matchup">
      <MatchupRow label="Weak to" items={weak} />
      <MatchupRow label="Resists" items={resist} />
      <MatchupRow label="Immune to" items={immune.map((type) => ({ type }))} />
    </div>
  );
}

export default TypeMatchup;
