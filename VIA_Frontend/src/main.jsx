import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import "./styles/index.css";
import { HashRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  //“For static hosting like Render, we can use HashRouter to avoid server-side routing issues.”
  <HashRouter>
    <App />
  </HashRouter>,
);
