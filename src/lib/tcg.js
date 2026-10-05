import { TCGDEX_API_URL } from "../config.js";

const cache = new Map();

function buildUrl(dexId, page, pageSize) {
  return (
    `${TCGDEX_API_URL}/cards` +
    `?dexId=eq:${dexId}` +
    `&pagination:page=${page}` +
    `&pagination:itemsPerPage=${pageSize}`
  );
}

async function tcgGet(url) {
  if (cache.has(url)) return cache.get(url);

  const request = fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`TCGdex request failed (${response.status})`);
    }
    return response.json();
  });

  cache.set(url, request);
  request.catch(() => cache.delete(url)); // don't cache failures
  return request;
}

/**
 * Cards for a National Dex number (from the Pokémon species id). TCGdex filters
 * the `dexId` array with strict equality (`eq:`), so forms and punctuation need
 * no name mapping. Adds normalized `low`/`high` image URLs.
 *
 * Returns `{ cards, hasMore }`. `hasMore` is derived from the RAW page length
 * (before dropping image-less cards), so filtering can't end paging early.
 */
export async function getTcgCards(dexId, page = 1, pageSize = 20) {
  const data = await tcgGet(buildUrl(dexId, page, pageSize));
  const raw = Array.isArray(data) ? data : [];

  const cards = raw
    .filter((card) => card.image)
    .map((card) => ({
      ...card,
      imageSmall: `${card.image}/low.webp`,
      imageLarge: `${card.image}/high.webp`,
    }));

  return { cards, hasMore: raw.length === pageSize };
}
