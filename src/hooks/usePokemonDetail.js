import { useEffect, useState } from "react";
import { getPokemon, getSpecies, getEvolutionChain } from "../lib/api.js";

export function usePokemonDetail(nameOrId) {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isCurrent = true;
    setState({ data: null, isLoading: true, error: null });

    async function load() {
      try {
        const pokemon = await getPokemon(nameOrId);
        const species = await getSpecies(pokemon.species.name);

        let evolution = null;
        try {
          evolution = await getEvolutionChain(species.evolution_chain.url);
        } catch {
          evolution = null;
        }

        if (isCurrent) {
          setState({
            data: { pokemon, species, evolution },
            isLoading: false,
            error: null,
          });
        }
      } catch (err) {
        if (isCurrent) {
          setState({ data: null, isLoading: false, error: err.message });
        }
      }
    }

    load();

    return () => {
      isCurrent = false;
    };
  }, [nameOrId]);

  return state;
}
