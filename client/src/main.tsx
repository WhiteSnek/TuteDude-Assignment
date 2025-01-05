import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App.tsx";
import { LandingPage } from "./pages";
import "./index.css";
import ExplorePage from "./pages/ExplorePage.tsx";
import UserProvider from "./context/UserProvider.tsx";
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:5000/api/v1'
const Layout: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route path="" element={<LandingPage />} />
        <Route path="/explore" element={<ExplorePage />} />
      </Route>
    )
  );

  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Layout />
  </StrictMode>
);
