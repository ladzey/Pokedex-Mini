import { TCG_API_URL } from "../config.js";
import { capitalize } from "../utils.js";

const cache = new Map();

// PokéAPI slugs -> exact TCG card names (punctuation/spacing differs).
const NAME_OVERRIDES = {
  "nidoran-f": "Nidoran ♀",
  "nidoran-m": "Nidoran ♂",
  "mr-mime": "Mr. Mime",
  "mime-jr": "Mime Jr.",
  "mr-rime": "Mr. Rime",
  "type-null": "Type: Null",
  farfetchd: "Farfetch'd",
  sirfetchd: "Sirfetch'd",
  "ho-oh": "Ho-Oh",
  "porygon-z": "Porygon-Z",
  "jangmo-o": "Jangmo-o",
  "hakamo-o": "Hakamo-o",
  "kommo-o": "Kommo-o",
  "tapu-koko": "Tapu Koko",
  "tapu-lele": "Tapu Lele",
  "tapu-bulu": "Tapu Bulu",
  "tapu-fini": "Tapu Fini",
  flabebe: "Flabébé",
  "wo-chien": "Wo-Chien",
  "chien-pao": "Chien-Pao",
  "ting-lu": "Ting-Lu",
  "chi-yu": "Chi-Yu",
};

export function toTcgName(pokemonName) {
  if (!pokemonName) return "";
  if (NAME_OVERRIDES[pokemonName]) return NAME_OVERRIDES[pokemonName];
  return capitalize(pokemonName); // "pikachu" -> "Pikachu", "tapu-koko" -> ...
}

function buildUrl(query, page, pageSize) {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    pageSize: String(pageSize),
    select: "id,name,number,rarity,images,set",
    orderBy: "-set.releaseDate",
  });
  return `${TCG_API_URL}/cards?${params.toString()}`;
}

async function tcgGet(url) {
  if (cache.has(url)) return cache.get(url);

  const request = fetch(url).then((response) => {
    if (!response.ok)
      throw new Error(`TCG request failed (${response.status})`);
    return response.json();
  });

  cache.set(url, request);
  request.catch(() => cache.delete(url)); // don't cache failures
  return request;
}

export async function getTcgCards(pokemonName, page = 1, pageSize = 20) {
  const exact = await tcgGet(
    buildUrl(`name:"${toTcgName(pokemonName)}"`, page, pageSize),
  );

  // Fall back to a wildcard on the first word if the exact name matched nothing
  // (e.g. a form the TCG names differently).
  if (page === 1 && (exact.totalCount ?? 0) === 0) {
    const base = toTcgName(pokemonName).split(/[\s.:]+/)[0];
    if (base) return tcgGet(buildUrl(`name:${base}*`, page, pageSize));
  }

  return exact;
}
