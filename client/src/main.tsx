import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App.tsx";
import { ExplorePage, LandingPage, ProfilePage } from "./pages";
import "./index.css";
import UserProvider from "./context/UserProvider.tsx";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URI
axios.defaults.validateStatus = (status) => {
  return status >= 200 && status < 600;
};
const Layout: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route path="" element={<LandingPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
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
