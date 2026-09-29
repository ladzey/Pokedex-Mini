import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getType } from "../lib/api.js";
import { usePokemonDetail } from "../hooks/usePokemonDetail.js";
import { useFetch } from "../hooks/useFetch.js";
import {
  capitalize,
  computeMatchups,
  formatHeight,
  formatWeight,
  getArtworkUrl,
  getShinyArtworkUrl,
  getEnglishFlavor,
  getGenus,
  parseEvolutionChain,
} from "../utils.js";
import TypeBadge from "../components/TypeBadge.jsx";
import StatBars from "../components/StatBars.jsx";
import TypeMatchup from "../components/TypeMatchup.jsx";
import EvolutionChain from "../components/EvolutionChain.jsx";
import SpriteGallery from "../components/SpriteGallery.jsx";
import CryButton from "../components/CryButton.jsx";
import { DetailSkeleton } from "../components/Skeletons.jsx";
import { ErrorState } from "../components/States.jsx";

function DetailPage() {
  const { name } = useParams();
  const { data, isLoading, error } = usePokemonDetail(name);
  const [showShiny, setShowShiny] = useState(false);

  const pokemon = data?.pokemon;
  const species = data?.species;
  const evolution = data?.evolution;

  const typeNames = pokemon ? pokemon.types.map((slot) => slot.type.name) : [];
  const typeKey = typeNames.join(",");

  const { data: typeDataList } = useFetch(
    () =>
      typeNames.length
        ? Promise.all(typeNames.map((type) => getType(type)))
        : Promise.resolve(null),
    [typeKey],
  );

  const matchups = useMemo(
    () => (typeDataList ? computeMatchups(typeDataList) : null),
    [typeDataList],
  );

  const stages = useMemo(
    () => (evolution ? parseEvolutionChain(evolution.chain) : []),
    [evolution],
  );

  useEffect(() => {
    document.title = pokemon
      ? `${capitalize(pokemon.name)} | PokéDex`
      : "PokéDex Mini";
  }, [pokemon]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowShiny(false);
  }, [name]);

  if (isLoading) return <DetailSkeleton />;

  if (error) {
    return (
      <ErrorState
        title="No scan found"
        message={`We couldn't find a Pokémon named “${name}”. Check the spelling or go back to the dex.`}
      />
    );
  }

  if (!pokemon) return null;

  const flavor = species ? getEnglishFlavor(species) : "";
  const genus = species ? getGenus(species) : "";
  const cryUrl = pokemon.cries?.latest ?? pokemon.cries?.legacy ?? null;

  return (
    <article className="detail-page" data-type={pokemon.types[0].type.name}>
      <div className="detail-topline">
        <Link to="/" className="back-link" viewTransition>
          ← Back to dex
        </Link>
        <span className="scan-tag">SCAN COMPLETE</span>
      </div>

      <header className="detail-header">
        <span className="detail-number">
          #{String(pokemon.id).padStart(3, "0")}
        </span>
        <h1 className="detail-name">{capitalize(pokemon.name)}</h1>
        <div className="detail-types">
          {pokemon.types.map((slot) => (
            <TypeBadge key={slot.type.name} type={slot.type.name} />
          ))}
        </div>
        <p className="detail-genus">{genus}</p>
      </header>

      <div className="detail-hero">
        <div className="detail-artwork">
          <img
            className="detail-artwork__img"
            src={
              showShiny
                ? getShinyArtworkUrl(pokemon.id)
                : getArtworkUrl(pokemon.id)
            }
            alt={pokemon.name}
            width={280}
            height={280}
          />
          <span className="detail-artwork__sweep" aria-hidden="true" />
        </div>

        <div className="detail-hero__info">
          {flavor && <p className="detail-flavor">{flavor}</p>}

          <dl className="vitals">
            <div>
              <dt>Height</dt>
              <dd>{formatHeight(pokemon.height)}</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{formatWeight(pokemon.weight)}</dd>
            </div>
            <div>
              <dt>Base XP</dt>
              <dd>{pokemon.base_experience ?? "—"}</dd>
            </div>
          </dl>

          <div className="abilities">
            <span className="abilities__label">Abilities</span>
            <ul className="abilities__list">
              {pokemon.abilities.map((slot) => (
                <li
                  key={slot.ability.name}
                  className={slot.is_hidden ? "is-hidden" : ""}
                >
                  {capitalize(slot.ability.name)}
                  {slot.is_hidden && <em> · hidden</em>}
                </li>
              ))}
            </ul>
          </div>

          <div className="detail-actions">
            <CryButton url={cryUrl} />
            <button
              type="button"
              className="btn btn--ghost"
              aria-pressed={showShiny}
              onClick={() => setShowShiny((value) => !value)}
            >
              <span className="btn__glyph" aria-hidden="true">
                ✦
              </span>
              {showShiny ? "Shiny on" : "Shiny off"}
            </button>
          </div>

          <SpriteGallery pokemon={pokemon} />
        </div>
      </div>

      <section className="panel">
        <h2 className="panel__title">Base stats</h2>
        <StatBars stats={pokemon.stats} />
      </section>

      {matchups && (
        <section className="panel">
          <h2 className="panel__title">Type matchup</h2>
          <TypeMatchup matchups={matchups} />
        </section>
      )}

      <section className="panel">
        <h2 className="panel__title">Evolution</h2>
        <EvolutionChain stages={stages} />
      </section>
    </article>
  );
}

export default DetailPage;
