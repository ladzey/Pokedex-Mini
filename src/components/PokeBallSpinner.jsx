function PokeBallSpinner({ label = "Loading" }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <span className="pokeball" aria-hidden="true" />
      <span className="spinner-label">{label}...</span>
    </div>
  );
}

export default PokeBallSpinner;
