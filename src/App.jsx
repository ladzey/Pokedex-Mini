import { HashRouter, Routes, Route } from "react-router-dom";
import ListPage from "./pages/ListPage.jsx";
import DetailPage from "./pages/DetailPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

function App() {
  return (
    <HashRouter>
      <div className="app">
        <h1>PokéDex Mini</h1>
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/pokemon/:name" element={<DetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
