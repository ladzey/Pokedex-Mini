import { statLabel } from "../utils.js";

const MAX_STAT = 200;

function tierFor(value) {
  if (value >= 100) return "high";
  if (value >= 60) return "mid";
  return "low";
}

function StatBars({ stats }) {
  const total = stats.reduce((sum, stat) => sum + stat.base_stat, 0);

  return (
    <div className="stats">
      <ul className="stat-list">
        {stats.map((stat) => {
          const percent = Math.min(100, (stat.base_stat / MAX_STAT) * 100);
          return (
            <li key={stat.stat.name} className="stat-row">
              <span className="stat-name">{statLabel(stat.stat.name)}</span>
              <span className="stat-track">
                <span
                  className="stat-fill"
                  data-tier={tierFor(stat.base_stat)}
                  style={{ "--pct": `${percent}%` }}
                />
              </span>
              <span className="stat-value">{stat.base_stat}</span>
            </li>
          );
        })}
      </ul>
      <p className="stat-total">
        Base stat total <strong>{total}</strong>
      </p>
    </div>
  );
}

export default StatBars;
