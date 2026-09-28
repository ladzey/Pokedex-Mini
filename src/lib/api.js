import { API_BASE_URL, FULL_LIST_URL } from "../config.js";

const cache = new Map();

/**
 * Fetch JSON from PokeAPI (or any absolute URL) with promise-level caching.
 * @param {string} path absolute URL or path beginning with "/"
 */
export function apiGet(path) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  if (cache.has(url)) return cache.get(url);

  const request = fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed (${response.status}) for ${url}`);
    }
    return response.json();
  });

  cache.set(url, request);

  // Never cache a rejection — allow a retry.
  request.catch(() => cache.delete(url));

  return request;
}

export function getAllPokemon() {
  return apiGet(FULL_LIST_URL);
}

export function getPokemon(nameOrId) {
  return apiGet(`/pokemon/${nameOrId}`);
}

export function getSpecies(nameOrId) {
  return apiGet(`/pokemon-species/${nameOrId}`);
}

export function getEvolutionChain(url) {
  return apiGet(url);
}

export function getType(name) {
  return apiGet(`.type/${name}`);
}
