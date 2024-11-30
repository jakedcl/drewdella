// App.jsx
import { BrowserRouter as Router, Routes, Route, createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx";
import ConnectPage from "./pages/ConnectPage/ConnectPage.jsx";
import AllPage from "./pages/AllPage/AllPage.jsx";
import ImagesPage from "./pages/ImagesPage/ImagesPage.jsx";
import Layout from "./components/Layout/Layout.jsx";
import MapPage from "./pages/MapPage/MapPage.jsx";
import VideosPage from "./pages/VideosPage/VideosPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: "connect",
        element: <ConnectPage />,
      },
      {
        path: "maps",
        element: <MapPage />,
      },
      {
        path: "all",
        element: <AllPage />,
      },
      {
        path: "videos",
        element: <VideosPage />,
      },
      {
        path: "images",
        element: <ImagesPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

function App() {
  return <RouterProvider router={router} />;
}

export default App;