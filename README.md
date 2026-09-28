# PokéDex Mini

A small React application for browsing Pokémon with data provided by the [PokéAPI](https://pokeapi.co/).

## Features

- Browse the first 20 Pokémon from the PokéAPI
- Search for a Pokémon by name
- View a Pokémon's official artwork, types, and base stats
- Navigate between the Pokémon list and detail pages
- Responsive loading and error states
- Client-side routing with React Router

## Tech stack

- React 19
- React Router
- Vite
- JavaScript
- PokéAPI

## Getting started

### Prerequisites

- Node.js and npm

### Installation

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open the local URL shown by Vite in your browser.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Deploy the `dist` directory to GitHub Pages |

## Project structure

```text
src/
├── components/
│   ├── Layout.jsx
│   ├── PokemonList.jsx
│   └── SearchForm.jsx
├── pages/
│   ├── DetailPage.jsx
│   ├── ListPage.jsx
│   └── NotFoundPage.jsx
├── App.jsx
├── config.js
├── index.css
├── main.jsx
└── utils.js
```

## Routes

- `/` — Pokémon list and search form
- `/pokemon/:name` — Pokémon details
- `*` — Not-found page

## Data sources

- Pokémon data: [PokéAPI](https://pokeapi.co/api/v2)
- Pokémon sprites: [PokeAPI sprites](https://github.com/PokeAPI/sprites)
