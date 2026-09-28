import { capitalize } from "../utils.js";

function TypeBadge({ type, size = "md" }) {
  if (!type) return null;
  return (
    <span className={`type-badge type-badge--${size}`} data-type={type}>
      {capitalize(type)}
    </span>
  );
}

export default TypeBadge;
