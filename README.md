# PokéDex Mini

A modern, light Pokédex for the National Dex, built with React and plain CSS.
Browse every Pokémon, view its stats, matchups, and evolution line, and scroll
through its real Pokémon TCG cards.

**Live demo:** https://ladzey.github.io/Pokedex-Mini/

---

## Features

### Browsing

- **Full National Dex** — every species (~1,300 entries) fetched once and cached.
- **Instant search** — debounced input with live sprite suggestions; press a
  suggestion or Enter to jump straight to its page.
- **Filters & sort** — filter by type (18 chips) and generation (I–IX), sort by
  number or name.
- **URL-synced state** — `?q=&type=&gen=&sort=` live in the URL, so views are
  shareable and the back button restores them.
- **Infinite scroll** — the next page of cards loads automatically just before
  you reach the bottom.

### Detail "scan"

- Official artwork with a one-shot **scan sweep**, plus a **shiny toggle**.
- **Sprite gallery** — official artwork, the Pokémon HOME render, and Dream
  World art (all HD); shiny via the toggle button.
- **Dex data** — flavor text, genus ("Mouse Pokémon"), height, weight, base XP,
  and abilities (hidden abilities marked).
- **Animated base stats** with a base-stat total.
- **Type matchup** — computed weaknesses, resistances, and immunities (handles
  dual types and ×0.25/×4 multipliers).
- **Evolution chain** — clickable stages with the evolution condition.
- **Cry playback** — plays the Pokémon's cry from the API.
- **Trading cards** — a scrollable rail of real Pokémon TCG cards (loaded 20 at
  a time); click a card to open its hi-res scan.

### Polish

- Boot-up intro, Pokéball spinner, and skeleton loaders.
- Route **view transitions** and scroll-reveal card animations.
- Per-Pokémon accent color derived from its primary type.
- Responsive from mobile to desktop, keyboard accessible, and respects
  `prefers-reduced-motion`.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| UI | React 19 |
| Routing | React Router 7 (`HashRouter`) |
| Build tool | Vite 8 |
| Styling | Plain CSS with custom-property design tokens (no framework) |
| Data | [PokéAPI](https://pokeapi.co/) + [PokeAPI sprites](https://github.com/PokeAPI/sprites) + the [Pokémon TCG API](https://pokemontcg.io/) |

No extra runtime dependencies beyond React and React Router — data fetching uses
the browser `fetch`, and animations use CSS plus the View Transitions API.

---

## Getting started

### Prerequisites

- Node.js 18+ and npm

### Install and run

```bash
npm install
npm run dev
```

Open the local URL Vite prints in your browser.

---

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with HMR |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint over the project |
| `npm run predeploy` | Hook that builds the app before deploying |
| `npm run deploy` | Publish `dist/` to GitHub Pages (`gh-pages` branch) |

---

## Project structure

```text
src/
├── components/
│   ├── BootScreen.jsx        # one-time boot-up intro
│   ├── CryButton.jsx         # plays a Pokémon's cry
│   ├── EvolutionChain.jsx    # clickable evolution stages
│   ├── FilterBar.jsx         # type chips + generation/sort selects
│ ├── Layout.jsx # top bar, search, footer, <Outlet />
│   ├── PokeBallSpinner.jsx   # loading indicator
│   ├── PokemonCard.jsx       # grid card with lazy type badges
│   ├── SearchBox.jsx         # debounced search + suggestions
│   ├── Skeletons.jsx         # card grid and detail skeletons
│ ├── SpriteGallery.jsx # sprite variant thumbnails
│ ├── StatBars.jsx # animated base stats
│ ├── States.jsx # error + empty states
│ ├── TcgCardRail.jsx # scrollable rail of real TCG cards
│ ├── TypeBadge.jsx # color-coded type pill
│ └── TypeMatchup.jsx # weakness / resistance / immunity rows
├── hooks/
│ ├── useDebounce.js
│ ├── useFetch.js # cached fetch with loading/error state
│ ├── useInfinite.js # paginated scroll window
│ ├── useLocalStorage.js
│ ├── usePokemonDetail.js # pokemon + species + evolution
│ ├── useReveal.js # scroll-reveal via IntersectionObserver
│ └── useTcgCards.js # paged Pokémon TCG cards
├── lib/
│ ├── api.js # cached PokéAPI client
│ └── tcg.js # cached Pokémon TCG API client
├── pages/
│   ├── ListPage.jsx
│   ├── DetailPage.jsx
│   └── NotFoundPage.jsx
├── styles/
│   ├── tokens.css            # colors, type palette, fonts
│   ├── base.css              # reset, layout, boot screen
│   └── components.css        # component styles
├── App.jsx
├── config.js # PokéAPI + sprite + TCG base URLs
├── index.css                 # imports the style layers
├── main.jsx
└── utils.js                  # ids, text, evolution, matchup helpers
```

---

## Routes

Routing uses `HashRouter`, so deep links work on GitHub Pages without any server
configuration.

| Path | Page |
| --- | --- |
| `/#/` | National Dex list, search, and filters |
| `/#/pokemon/:name` | Detail "scan" for a Pokémon |
| `/#/*` | Not-found page |

---

## Data sources

Pokémon data comes from [PokéAPI](https://pokeapi.co/):

| Endpoint | Used for |
| --- | --- |
| `GET /pokemon?limit=100000` | Full species list (search, sort, filter, paging) |
| `GET /pokemon/{name-or-id}` | Stats, types, abilities, sprites, cries |
| `GET /pokemon-species/{name-or-id}` | Flavor text, genus, evolution chain URL |
| `GET /evolution-chain/{id}` | Evolution stages |
| `GET /type/{name}` | Type matchups and type membership |

Artwork and sprites are served from the PokeAPI sprites repository:

- `.../sprites/pokemon/{id}.png`
- `.../sprites/pokemon/other/official-artwork/{id}.png` (and `/shiny/`)

Trading-card data comes from the [Pokémon TCG API](https://pokemontcg.io/):

| Endpoint | Used for |
| --- | --- |
| `GET /cards?q=name:"<Name>"&pageSize=20` | Real trading cards for a Pokémon (paged) |

Card images are hosted at `https://images.pokemontcg.io/...`.

---

## Design notes

The UI is intentionally soft and modern: light surfaces, a red Pokéball accent,
flat type-tinted chips, and rounded typography (Baloo 2 + Inter). Colors,
spacing, and radii live as custom properties in `src/styles/tokens.css`, and each
of the 18 canonical type colors is exposed as `--type-*`, driving per-Pokémon
accents and badges.

---

## Deployment

Deployed to GitHub Pages via the `gh-pages` package. `vite.config.js` sets
`base: "/Pokedex-Mini/"`, which must match the repository name.

```bash
npm run deploy
```

After a change, remember that a normal push updates the **source** on `main`,
while `npm run deploy` updates the **live site** — you usually need both.

---

## Known issues / roadmap

No known issues at the moment.

Planned extras:

- **Who's That Pokémon?** — silhouette guessing game.
- **Favorites / team builder** — save six Pokémon and summarize type coverage.
- **Compare mode** — two Pokémon side by side.

---

## Credits

Data from [PokéAPI](https://pokeapi.co/) and the [Pokémon TCG API](https://pokemontcg.io/). Built with React 19 + Vite.
