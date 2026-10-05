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
  getEnglishFlavor,
  getGenus,
  getSpriteOptions,
  parseEvolutionChain,
} from "../utils.js";
import TypeBadge from "../components/TypeBadge.jsx";
import StatBars from "../components/StatBars.jsx";
import TypeMatchup from "../components/TypeMatchup.jsx";
import EvolutionChain from "../components/EvolutionChain.jsx";
import SpriteGallery from "../components/SpriteGallery.jsx";
import CryButton from "../components/CryButton.jsx";
import TcgCardRail from "../components/TcgCardRail.jsx";
import { DetailSkeleton } from "../components/Skeletons.jsx";
import { ErrorState } from "../components/States.jsx";

function DetailPage() {
  const { name } = useParams();
  const { data, isLoading, error } = usePokemonDetail(name);
  const [spriteKey, setSpriteKey] = useState("artwork");

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

  const spriteOptions = useMemo(
    () => (pokemon ? getSpriteOptions(pokemon) : []),
    [pokemon],
  );

  const galleryOptions = useMemo(
    () => spriteOptions.filter((option) => option.key !== "shiny"),
    [spriteOptions],
  );

  useEffect(() => {
    document.title = pokemon
      ? `${capitalize(pokemon.name)} | PokéDex`
      : "PokéDex Mini";
  }, [pokemon]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSpriteKey("artwork");
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
  const activeSprite =
    spriteOptions.find((option) => option.key === spriteKey) ??
    spriteOptions[0];
  const tcgName = pokemon.species?.name ?? pokemon.name;

  return (
    <article className="detail-page" data-type={pokemon.types[0].type.name}>
      <div className="detail-topline">
        <Link to="/" className="back-link" viewTransition>
          ← Back to dex
        </Link>
        <span key={pokemon.id} className="scan-tag">
          SCAN COMPLETE
        </span>
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

      <div className="detail-layout">
        <aside className="detail-media">
          <div className="detail-artwork">
            <img
              className="detail-artwork__img"
              src={activeSprite?.src ?? getArtworkUrl(pokemon.id)}
              alt={pokemon.name}
              width={280}
              height={280}
            />
            <span
              key={pokemon.id}
              className="detail-artwork__sweep"
              aria-hidden="true"
            />
          </div>

          <div className="detail-actions">
            <CryButton url={cryUrl} />
            <button
              type="button"
              className="btn btn--ghost"
              aria-pressed={spriteKey === "shiny"}
              onClick={() =>
                setSpriteKey((key) => (key === "shiny" ? "artwork" : "shiny"))
              }
            >
              <span className="btn__glyph" aria-hidden="true">
                ✦
              </span>
              {spriteKey === "shiny" ? "Shiny on" : "Shiny off"}
            </button>
          </div>

          <SpriteGallery
            options={galleryOptions}
            value={spriteKey}
            onChange={setSpriteKey}
          />

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
        </aside>

        <div className="detail-body">
          {flavor && <p className="detail-flavor">{flavor}</p>}

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

          <section className="panel">
            <h2 className="panel__title">Base stats</h2>
            <StatBars key={pokemon.id} stats={pokemon.stats} />
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
        </div>
      </div>
      <section className="panel detail-tcg">
        <h2 className="panel__title">Trading Cards</h2>
        <TcgCardRail key={tcgName} pokemonName={tcgName} />
      </section>
    </article>
  );
}

export default DetailPage;
