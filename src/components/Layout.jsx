import { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import SearchBox from "./SearchBox.jsx";
import BootScreen from "./BootScreen.jsx";

const BOOT_FLAG = "pokedex-booted";

function Layout() {
  const [isBooting, setIsBooting] = useState(
    () => !window.sessionStorage.getItem(BOOT_FLAG),
  );

  useEffect(() => {
    if (!isBooting) return undefined;
    const timer = setTimeout(() => {
      window.sessionStorage.setItem(BOOT_FLAG, "1");
      setIsBooting(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [isBooting]);

  return (
    <div className="app">
      {isBooting && <BootScreen />}

      <header className="topbar">
        <Link to="/" className="brand" aria-label="PokéDex Mini home">
          <span className="brand__ball" aria-hidden="true" />
          <span className="brand__name">PokéDex</span>
        </Link>
        <SearchBox />
      </header>

      <main className="app__main">
        <Outlet />
      </main>

      <footer className="footer">
        Data from{" "}
        <a href="https://pokeapi.co" target="_blank" rel="noreferrer">
          PokéAPI
        </a>{" "}
        and{" "}
        <a href="https://tcgdex.dev" target="_blank" rel="noreferrer">
          TCGdex
        </a>
      </footer>
    </div>
  );
}

export default Layout;
