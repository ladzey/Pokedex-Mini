import { capitalize } from "../utils.js";

function SpriteGallery({ options, value, onChange }) {
  return (
    <div className="gallery">
      <div className="gallery__thumbs" role="group" aria-label="Sprite gallery">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            className={`gallery__thumb ${
              value === option.key ? "is-active" : ""
            }`}
            aria-pressed={value === option.key}
            onClick={() => onChange(option.key)}
          >
            <img src={option.src} alt={option.label} width={48} height={48} />
          </button>
        ))}
      </div>
      <p className="gallery__caption">{capitalize(value)} view</p>
    </div>
  );
}

export default SpriteGallery;
