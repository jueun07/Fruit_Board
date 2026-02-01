import "./index.css"; // ← 무조건 맨 위
import "./styles/header-common.css";
import "./styles/global.css";
import React from "react";
import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./context/CartContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </HashRouter>
  </React.StrictMode>
);
