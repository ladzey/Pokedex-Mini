import { useState } from "react";
import { getArtworkUrl, getShinyArtworkUrl, capitalize } from "../utils.js";

function SpriteGallery({ pokemon }) {
  const sprites = pokemon.sprites;
  const options = [
    { key: "artwork", label: "Artwork", src: getArtworkUrl(pokemon.id) },
    {
      key: "shiny",
      label: "Shiny",
      src: getShinyArtworkUrl(pokemon.id),
    },
    sprites.front_default && {
      key: "front",
      label: "Front",
      src: sprites.front_default,
    },
    sprites.back_default && {
      key: "back",
      label: "Back",
      src: sprites.back_default,
    },
  ].filter(Boolean);

  const [active, setActive] = useState(options[0]?.key);

  return (
    <div className="gallery">
      <div className="gallery__thumbs" role="group" aria-label="Sprite gallery">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            className={`gallery__thumb ${
              active === option.key ? "is-active" : ""
            }`}
            aria-pressed={active === option.key}
            onClick={() => setActive(option.key)}
          >
            <img src={option.src} alt={option.label} width={48} height={48} />
          </button>
        ))}
      </div>
      <p className="gallery__caption">{capitalize(active)} view</p>
    </div>
  );
}

export default SpriteGallery;
