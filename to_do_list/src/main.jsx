import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ManualButton from "./manual.jsx";
import "./Main.css";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ManualButton className="manualButton" />
    <App />
  </StrictMode>,
);
