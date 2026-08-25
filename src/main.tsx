import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.tsx";
import AdminPanel from "./components/AdminPanel";

const path = window.location.pathname;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    {path === "/admin" ? <AdminPanel /> : <App />}
  </HelmetProvider>
);
