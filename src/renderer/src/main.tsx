import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const params = new URLSearchParams(window.location.search);
const initialFen = params.get("fen") ?? undefined;
const modeParam = params.get("mode");
const initialMode = modeParam === "ai" || modeParam === "local" ? modeParam : undefined;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App initialFen={initialFen} initialMode={initialMode} />
  </React.StrictMode>
);
