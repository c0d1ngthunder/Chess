import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";
import Context from "./context/Context";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Context>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </Context>
  </StrictMode>
);
