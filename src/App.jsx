// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx";
import ConnectPage from "./pages/ConnectPage/ConnectPage.jsx";
import AllPage from "./pages/AllPage/AllPage.jsx";
import ImagesPage from "./pages/ImagesPage/ImagesPage.jsx";
import Layout from "./components/Layout/Layout.jsx";
import MapPage from "./pages/MapPage/MapPage.jsx";
import VideosPage from "./pages/VideosPage/VideosPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<Layout />}>
          <Route path="/connect" element={<ConnectPage />} />
          <Route path="/maps" element={<MapPage />} />
          <Route path="/all" element={<AllPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/images" element={<ImagesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;