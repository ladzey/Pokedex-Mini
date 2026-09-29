import { SPRITE_BASE_URL, ARTWORK_BASE_URL } from "./config.js";

const TYPE_LIST = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

// ----------------------------------------------------------
// URLs / ids
// ----------------------------------------------------------
export function getIdFromUrl(url) {
  // url looks like "https://pokeapi.co/api/v2/pokemon/25/"
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

export function padId(id) {
  return String(id).padStart(3, "0");
}

export function getSpriteUrl(id) {
  return `${SPRITE_BASE_URL}/${id}.png`;
}

export function getArtworkUrl(id) {
  return `${ARTWORK_BASE_URL}/${id}.png`;
}

export function getShinyArtworkUrl(id) {
  return `${ARTWORK_BASE_URL}/shiny/${id}.png`;
}

/**
 * Build the selectable sprite variants for a Pokémon. Used by both the hero
 * image and the gallery so they stay in sync.
 */
export function getSpriteOptions(pokemon) {
  const sprites = pokemon.sprites;
  const artwork = sprites.other?.["official-artwork"] ?? {};
  const home = sprites.other?.home ?? {};
  const dreamWorld = sprites.other?.dream_world ?? {};

  return [
    {
      key: "artwork",
      label: "Artwork",
      src: artwork.front_default ?? getArtworkUrl(pokemon.id),
    },
    {
      key: "shiny",
      label: "Shiny",
      src:
        artwork.front_shiny ??
        home.front_shiny ??
        getShinyArtworkUrl(pokemon.id),
    },
    {
      key: "front",
      label: "Front",
      src: home.front_default ?? sprites.front_default,
    },
    dreamWorld.front_default && {
      key: "dream-world",
      label: "Dream World",
      src: dreamWorld.front_default,
    },
  ].filter((option) => option && option.src);
}

// ----------------------------------------------------------
// Text
// ----------------------------------------------------------

export function capitalize(name) {
  if (!name) return "";
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function cleanFlavor(text) {
  return text
    .replace(/[\n\f\r]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getEnglishFlavor(species) {
  const entry = species.flavor_text_entries.find(
    (e) => e.language.name === "en",
  );
  return entry ? cleanFlavor(entry.flavor_text) : "";
}

export function getGenus(species) {
  const genus = species.genera.find((g) => g.language.name === "en");
  return genus ? genus.genus : "Unknown Pokémon";
}

export function formatHeight(decimetres) {
  return `${(decimetres / 10).toFixed(1)} m`;
}

export function formatWeight(hectograms) {
  return `${(hectograms / 10).toFixed(1)} kg`;
}

export function statLabel(statName) {
  const labels = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    speed: "Speed",
  };
  return labels[statName] ?? capitalize(statName);
}

// ----------------------------------------------------------
// Evolution
// ----------------------------------------------------------

export function parseEvolutionChain(chain) {
  const stages = [];

  function walk(node, depth) {
    if (!stages[depth]) stages[depth] = [];

    const details = node.evolution_details[0] || {};
    stages[depth].push({
      id: Number(getIdFromUrl(node.species.url)),
      name: node.species.name,
      minLevel: details.min_level ?? null,
      trigger: details.trigger ? details.trigger.name : null,
      item: details.item ? details.item.name : null,
    });

    node.evolves_to.forEach((child) => walk(child, depth + 1));
  }

  walk(chain, 0);
  return stages;
}

// ----------------------------------------------------------
// Type matchups
// ----------------------------------------------------------

export function computeMatchups(typeDataList) {
  const result = {};

  for (const typeData of typeDataList) {
    const relations = typeData.damage_relations;

    const apply = (list, multiplier) => {
      for (const entry of list) {
        result[entry.name] = (result[entry.name] ?? 1) * multiplier;
      }
    };

    apply(relations.double_damage_from, 2);
    apply(relations.half_damage_from, 0.5);
    apply(relations.no_damage_from, 0);
  }

  return result;
}

export function groupMatchups(matchups) {
  const weak = [];
  const resist = [];
  const immune = [];

  for (const [type, multiplier] of Object.entries(matchups)) {
    if (multiplier === 0) immune.push(type);
    else if (multiplier >= 2) weak.push({ type, multiplier });
    else if (multiplier <= 0.5) resist.push({ type, multiplier });
  }

  weak.sort((a, b) => b.multiplier - a.multiplier);
  resist.sort((a, b) => a.multiplier - b.multiplier);
  immune.sort();
  return { weak, resist, immune };
}

export const ALL_TYPES = TYPE_LIST;
